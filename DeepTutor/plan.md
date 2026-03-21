# 案例项目创建功能 — 详细实现计划

## 背景与目标

在 DeepTutor 中新增"案例项目创建"功能（Project Creator），与 Question Generator、Smart Solver 等并列。

**三大子功能：**
1. **任务书生成**：用户上传参考任务书 + 输入新主题，AI 生成结构相同、内容全新的任务书
2. **代码仓库生成**：基于生成的任务书，调用 Claude Agent SDK 自动创建 git 仓库并生成项目骨架代码
3. **多源信息融合**：生成过程中可检索 RAG 知识库 + 实时网络搜索

**参考任务书结构**（基于 `book/嵌入式开发暑期实习任务书.docx`）：

生成的新任务书须包含以下 9 个章节：
1. 封面信息（课程名、专业、实习时间）
2. 课程背景与目标（4 条目标）
3. 模块概述（3-4 个模块）
4. 各模块设计内容（带编号子任务，含技术要求）
5. 作业要求（格式、页数、报告提纲）
6. 提交成果（代码、报告、视频、数据）
7. 成绩考核（评分维度 + 分级标准）
8. 时间安排（各阶段日期）
9. 参考资源（附录链接 + 教材书单）

---

## 整体架构

```
用户上传参考任务书(.docx/.pdf) + 输入新主题
              ↓
     ┌── Step 1: 任务书生成 ──┐
     │  task_parser.py        │  解析参考文档结构
     │  task_generator.py     │  RAG检索 + Web搜索 + LLM生成
     │  WebSocket流式输出      │  实时推送给前端
     └────────────────────────┘
              ↓
     用户在前端审阅/编辑 → 下载 md/docx
              ↓
     ┌── Step 2: 代码仓库生成 ──┐
     │  code_generator.py       │  Claude Agent SDK
     │  创建 git 仓库             │  data/user/projects/{id}/repo/
     │  生成项目骨架代码          │  WebSocket推送Agent日志
     └──────────────────────────┘
              ↓
     前端展示文件树 + 提供下载
```

---

## Phase 1：后端 — 任务书生成

### 1.1 新增文件结构

```
src/
├── api/routers/project.py              ← 新建：路由定义
├── agents/project/
│   ├── __init__.py                     ← 新建
│   ├── coordinator.py                  ← 新建：主协调器
│   ├── session_manager.py              ← 新建：会话存储
│   ├── agents/
│   │   ├── __init__.py                 ← 新建
│   │   ├── task_parser.py              ← 新建：解析参考任务书
│   │   ├── task_generator.py           ← 新建：生成新任务书
│   │   └── code_generator.py           ← 新建：代码仓库生成
│   └── prompts/
│       ├── zh/
│       │   ├── task_generation.yaml    ← 新建：中文提示词
│       │   └── code_generation.yaml    ← 新建
│       └── en/
│           ├── task_generation.yaml    ← 新建：英文提示词
│           └── code_generation.yaml    ← 新建
```

### 1.2 路由文件 `src/api/routers/project.py`

参考 `src/api/routers/question.py` 的 WebSocket 模式。

**路由定义：**
```python
router = APIRouter()

# REST 端点
@router.post("/project/upload-reference")
async def upload_reference(files: list[UploadFile] = File(...)) -> dict:
    """上传参考任务书，解析并返回文档结构"""

@router.get("/project/sessions")
async def list_sessions(limit: int = 20) -> dict:
    """获取历史项目列表"""

@router.get("/project/sessions/{session_id}")
async def get_session(session_id: str) -> dict:
    """获取单个项目详情"""

@router.delete("/project/sessions/{session_id}")
async def delete_session(session_id: str) -> dict:
    """删除项目"""

@router.get("/project/{session_id}/download-task")
async def download_task(session_id: str, format: str = "md") -> FileResponse:
    """下载任务书（md 或 docx 格式）"""

# WebSocket 端点
@router.websocket("/project/generate-task")
async def websocket_generate_task(websocket: WebSocket):
    """流式生成新任务书"""

@router.websocket("/project/generate-code")
async def websocket_generate_code(websocket: WebSocket):
    """流式生成代码仓库（调用 Claude Agent SDK）"""
```

**WebSocket 消息协议（沿用现有约定）：**
```python
# 客户端 → 服务端（generate-task）
{
    "theme": "ROS 机器人导航实习",
    "reference_structure": { ... },   # upload-reference 返回的结构
    "kb_name": "raspberry_pi_cookbook",
    "web_search": true,
    "session_id": null                # null=新建，有值=继续
}

# 服务端 → 客户端（流式消息）
{"type": "status",    "content": "正在检索知识库..."}
{"type": "log",       "content": "RAG 查询: 机器人导航基础..."}
{"type": "chunk",     "content": "## 一、课程背景\n"}  # 任务书内容逐步输出
{"type": "section",   "section": "background", "content": "..."}  # 按章节通知
{"type": "token_stats","stats": {"calls": 3, "tokens": 2048}}
{"type": "complete",  "session_id": "proj_xxx", "output_dir": "..."}
{"type": "error",     "content": "错误信息"}
```

**generate-task 端点完整实现逻辑：**
```python
@router.websocket("/project/generate-task")
async def websocket_generate_task(websocket: WebSocket):
    await websocket.accept()
    log_queue = asyncio.Queue()

    try:
        # 1. 接收配置
        data = await websocket.receive_json()
        theme = data.get("theme", "")
        reference_structure = data.get("reference_structure", {})
        kb_name = data.get("kb_name")
        web_search = data.get("web_search", False)
        session_id = data.get("session_id")

        # 2. 获取 LLM 配置（复用现有 config）
        llm_config = get_llm_config()

        # 3. 创建或恢复会话
        session_mgr = ProjectSessionManager()
        if not session_id:
            session_id = session_mgr.create_session(theme=theme, kb_name=kb_name)

        # 4. 初始化 Coordinator
        coordinator = ProjectCoordinator(
            api_key=llm_config.api_key,
            base_url=llm_config.base_url,
            kb_name=kb_name,
            web_search_enabled=web_search,
            language=get_ui_language(),
            output_dir=str(get_project_output_dir(session_id))
        )

        # 5. 设置 WebSocket 回调（参考 question.py 模式）
        async def ws_callback(msg: dict):
            await log_queue.put(msg)
        coordinator.set_ws_callback(ws_callback)

        # 6. 启动日志推送任务
        async def log_pusher():
            while True:
                entry = await log_queue.get()
                if entry is None:
                    break
                try:
                    await websocket.send_json(entry)
                except Exception:
                    break

        pusher_task = asyncio.create_task(log_pusher())

        # 7. 执行生成
        result = await coordinator.generate_task_document(
            theme=theme,
            reference_structure=reference_structure
        )

        # 8. 发送完成
        await log_queue.put(None)
        await pusher_task
        await websocket.send_json({
            "type": "complete",
            "session_id": session_id,
            "task_md_path": result["md_path"],
            "task_content": result["content"]
        })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"type": "error", "content": str(e)})
    finally:
        await websocket.close()
```

### 1.3 任务书解析器 `src/agents/project/agents/task_parser.py`

```python
class TaskParser:
    """解析参考任务书，提取文档结构"""

    SECTION_PATTERNS = {
        "cover": ["课程名称", "专业", "实习时间", "封面"],
        "objectives": ["课程目标", "设计目标", "学习目标"],
        "modules": ["模块", "阶段", "任务概述"],
        "details": ["设计内容", "任务内容", "具体要求"],
        "requirements": ["作业要求", "报告要求", "提交格式"],
        "deliverables": ["提交成果", "交付物"],
        "grading": ["成绩考核", "评分标准", "考核方式"],
        "schedule": ["时间安排", "进度计划"],
        "references": ["参考资料", "教材", "附录"]
    }

    def parse_docx(self, file_path: str) -> dict:
        """解析 .docx 文件，返回结构化内容"""
        from docx import Document
        doc = Document(file_path)
        # 返回格式：
        # {
        #   "sections": {
        #     "cover": {"title": "...", "content": "..."},
        #     "objectives": {...},
        #     ...
        #   },
        #   "module_count": 3,
        #   "has_grading_table": True,
        #   "raw_text": "完整文本"
        # }

    def parse_pdf(self, file_path: str) -> dict:
        """解析 .pdf 文件（使用 PyMuPDF）"""

    def extract_structure_summary(self, parsed: dict) -> str:
        """生成结构摘要，用于提示词"""
```

### 1.4 任务书生成器 `src/agents/project/agents/task_generator.py`

```python
class TaskGenerator:
    """
    生成新任务书，流程：
    1. RAG 检索相关知识
    2. Web Search 获取最新资料（可选）
    3. 逐章节流式生成
    4. 导出 Markdown + docx
    """

    async def generate(
        self,
        theme: str,
        reference_structure: dict,
        kb_name: str | None,
        web_search: bool,
        ws_callback: Callable
    ) -> dict:
        # Step 1: RAG 检索
        await ws_callback({"type": "status", "content": "正在检索知识库..."})
        rag_context = await self._rag_retrieve(theme, kb_name)

        # Step 2: Web 搜索
        if web_search:
            await ws_callback({"type": "status", "content": "正在网络搜索..."})
            web_context = await self._web_search(theme)
        else:
            web_context = ""

        # Step 3: 逐章节生成（流式）
        sections = {}
        for section_key, section_title in SECTION_ORDER:
            await ws_callback({"type": "status", "content": f"正在生成：{section_title}"})
            prompt = self._build_section_prompt(
                section_key, theme, reference_structure,
                rag_context, web_context, sections
            )
            section_content = ""
            async for chunk in llm_stream(prompt, ...):
                section_content += chunk
                await ws_callback({"type": "chunk", "content": chunk})
            sections[section_key] = section_content
            await ws_callback({"type": "section", "section": section_key, "content": section_content})

        # Step 4: 组合并导出
        full_md = self._assemble_markdown(sections)
        md_path = self._save_markdown(full_md)
        docx_path = self._export_docx(full_md)

        return {"content": full_md, "md_path": str(md_path), "docx_path": str(docx_path)}

    async def _rag_retrieve(self, theme: str, kb_name: str) -> str:
        """调用现有 RAG 服务检索相关内容"""
        # 复用 src/services/rag/ 中现有的检索逻辑

    async def _web_search(self, theme: str) -> str:
        """调用现有 Search 服务"""
        # 复用 src/services/search/ 中现有逻辑
```

**提示词文件 `prompts/zh/task_generation.yaml`：**
```yaml
system: |
  你是一个专业的课程任务书设计专家。请基于参考任务书的结构，
  为新主题生成结构完全相同、内容全新的任务书章节。
  要求：内容专业、具体、可执行；技术细节准确；难度适中。

section_prompts:
  cover: |
    生成任务书封面信息，主题：{theme}
    包含：课程名称、适用专业、实习时间段
    参考格式：{reference_cover}

  objectives: |
    为主题"{theme}"生成4条课程目标，参考以下知识：
    {rag_context}
    参考结构：{reference_objectives}
    要求：涵盖理论实践、自主学习、表达能力、创新动手四个维度

  modules: |
    为主题"{theme}"设计3-4个实践模块概述
    已有知识背景：{rag_context}
    网络资料：{web_context}
    参考结构：{reference_modules}

  # ... 其余章节
```

### 1.5 会话管理器 `src/agents/project/session_manager.py`

参考 `src/agents/solve/session_manager.py` 实现，存储到 `data/user/project_sessions.json`。

```python
# 会话数据结构
{
    "session_id": "proj_1726543210000_a1b2c3",
    "theme": "ROS 机器人导航实习",
    "kb_name": "raspberry_pi_cookbook",
    "status": "task_generated",  # init | task_generating | task_generated | code_generating | complete
    "task_md_path": "data/user/projects/proj_xxx/generated_task.md",
    "task_docx_path": "data/user/projects/proj_xxx/generated_task.docx",
    "repo_path": "data/user/projects/proj_xxx/repo/",
    "reference_structure": { ... },
    "token_stats": { ... },
    "created_at": 1726543210.123,
    "updated_at": 1726543220.456
}
```

### 1.6 注册路由 `src/api/main.py`

在现有路由注册块中添加（约第190-200行）：
```python
from src.api.routers import project
app.include_router(project.router, prefix="/api/v1", tags=["project"])
```

### 1.7 数据目录结构

```
data/user/projects/
├── project_sessions.json              ← 会话索引
└── proj_1726543210000_a1b2c3/
    ├── reference_task.docx            ← 用户上传的参考文档
    ├── reference_structure.json       ← 解析出的结构
    ├── generated_task.md              ← 生成的任务书（Markdown）
    ├── generated_task.docx            ← 生成的任务书（Word）
    └── repo/                          ← Claude Agent SDK 生成的代码
        ├── .git/
        ├── README.md
        ├── requirements.txt
        └── src/
```

---

## Phase 2：前端 — 任务书生成 UI

### 2.1 修改 `web/components/Sidebar.tsx`

**第 1 步：** 在文件顶部 import 中添加图标（约第 8-28 行）：
```typescript
import { FolderGit2 } from "lucide-react";
```

**第 2 步：** 在 `ALL_NAV_ITEMS` 中添加（约第 42-53 行）：
```typescript
"/project": { icon: FolderGit2, nameKey: "Project Creator" },
```

### 2.2 修改 `web/context/GlobalContext.tsx`

**第 1 步：** 添加类型定义（在现有类型定义区域）：
```typescript
interface ProjectState {
  step: "config" | "task_generating" | "task_review" | "code_generating" | "complete";
  theme: string;
  selectedKb: string;
  webSearchEnabled: boolean;
  uploadedFile: File | null;
  referenceStructure: Record<string, any> | null;
  // 任务书生成
  taskContent: string;          // 流式积累的 Markdown 内容
  taskSections: Record<string, string>;  // 已完成的章节
  currentSection: string | null;
  taskMdPath: string | null;
  taskDocxPath: string | null;
  // 代码生成
  agentLogs: AgentLogEntry[];   // Claude Agent SDK 的操作日志
  generatedFiles: FileTreeNode[];  // 生成的文件树
  repoPath: string | null;
  // 通用
  sessionId: string | null;
  logs: LogEntry[];
  tokenStats: TokenStats;
  error: string | null;
}

interface AgentLogEntry {
  timestamp: string;
  type: "tool_use" | "tool_result" | "message" | "error";
  tool?: string;          // "Write" | "Edit" | "Bash" | "Read" 等
  path?: string;          // 操作的文件路径
  content: string;
}

interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
}
```

**第 2 步：** 添加默认 State：
```typescript
const DEFAULT_PROJECT_STATE: ProjectState = {
  step: "config",
  theme: "",
  selectedKb: "",
  webSearchEnabled: false,
  uploadedFile: null,
  referenceStructure: null,
  taskContent: "",
  taskSections: {},
  currentSection: null,
  taskMdPath: null,
  taskDocxPath: null,
  agentLogs: [],
  generatedFiles: [],
  repoPath: null,
  sessionId: null,
  logs: [],
  tokenStats: { model: "Unknown", calls: 0, tokens: 0, input_tokens: 0, output_tokens: 0, cost: 0 },
  error: null
};
```

**第 3 步：** 在 `GlobalContextType` 中添加：
```typescript
// Project Creator
projectState: ProjectState;
setProjectState: React.Dispatch<React.SetStateAction<ProjectState>>;
uploadReference: (file: File) => Promise<void>;
startTaskGeneration: () => void;
startCodeGeneration: () => void;
resetProject: () => void;
```

**第 4 步：** 在 `DEFAULT_NAV_ORDER.learnResearch` 中添加 `"/project"`：
```typescript
learnResearch: ["/question", "/solver", "/guide", "/ideagen", "/research", "/co_writer", "/project"],
```

**第 5 步：** 实现 `startTaskGeneration` 函数（WebSocket 连接，参考 `startSolver` 模式）：
```typescript
const startTaskGeneration = () => {
  if (projectWs.current) projectWs.current.close();

  setProjectState(prev => ({ ...prev, step: "task_generating", taskContent: "", taskSections: {}, error: null }));

  const ws = new WebSocket(wsUrl("/api/v1/project/generate-task"));
  projectWs.current = ws;

  ws.onopen = () => {
    ws.send(JSON.stringify({
      theme: projectState.theme,
      reference_structure: projectState.referenceStructure,
      kb_name: projectState.selectedKb || null,
      web_search: projectState.webSearchEnabled,
      session_id: projectState.sessionId
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "chunk":
        setProjectState(prev => ({ ...prev, taskContent: prev.taskContent + data.content }));
        break;
      case "section":
        setProjectState(prev => ({ ...prev, taskSections: { ...prev.taskSections, [data.section]: data.content }, currentSection: data.section }));
        break;
      case "status":
      case "log":
        setProjectState(prev => ({ ...prev, logs: [...prev.logs, { type: data.type, content: data.content, timestamp: Date.now() }] }));
        break;
      case "token_stats":
        setProjectState(prev => ({ ...prev, tokenStats: data.stats }));
        break;
      case "complete":
        setProjectState(prev => ({ ...prev, step: "task_review", sessionId: data.session_id, taskMdPath: data.task_md_path }));
        break;
      case "error":
        setProjectState(prev => ({ ...prev, step: "config", error: data.content }));
        break;
    }
  };
};
```

### 2.3 新建页面 `web/app/project/page.tsx`

**整体结构（4 步 Wizard）：**
```
┌─────────────────────────────────────────────────────┐
│  Project Creator                          [日志抽屉] │
├─────────────────────────────────────────────────────┤
│  Step 1: 配置     Step 2: 生成任务书                  │
│  Step 3: 审阅     Step 4: 生成代码                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Step 1 — 配置]                                    │
│  ┌──────────────────────┐  ┌──────────────────────┐ │
│  │ 上传参考任务书          │  │ 输入新主题             │ │
│  │ [拖拽/点击上传 .docx]  │  │ [文本输入框]           │ │
│  └──────────────────────┘  └──────────────────────┘ │
│  选择知识库: [下拉]   开启网络搜索: [Toggle]           │
│                              [开始生成任务书 →]       │
│                                                     │
│  [Step 2 — 生成任务书]                              │
│  左侧：进度状态 + 章节完成情况                         │
│  右侧：Markdown 实时渲染（流式追加）                   │
│                                                     │
│  [Step 3 — 审阅任务书]                              │
│  Markdown 完整预览（可复制）                          │
│  [下载 .md] [下载 .docx] [→ 生成代码仓库]            │
│                                                     │
│  [Step 4 — 代码生成]                                │
│  左侧：Agent 操作日志（工具调用流）                    │
│  右侧：文件树（实时更新）                              │
│  完成后：[下载 zip] [查看文件]                        │
└─────────────────────────────────────────────────────┘
```

**页面代码骨架：**
```typescript
"use client";
import { useGlobal } from "@/context/GlobalContext";
import { useTranslation } from "react-i18next";
import { apiUrl, wsUrl } from "@/lib/api";
import ReactMarkdown from "react-markdown";

export default function ProjectPage() {
  const { projectState, setProjectState, uploadReference, startTaskGeneration, startCodeGeneration, resetProject } = useGlobal();
  const { t } = useTranslation();
  const [kbs, setKbs] = useState<string[]>([]);

  // 获取知识库列表（复用现有模式）
  useEffect(() => {
    fetch(apiUrl("/api/v1/knowledge/list"))
      .then(r => r.json())
      .then(data => setKbs(data.knowledge_bases?.map((kb: any) => kb.name) || []));
  }, []);

  const step = projectState.step;

  return (
    <div className="flex h-full">
      {/* 步骤向导头部 */}
      <StepIndicator currentStep={step} steps={STEPS} />

      {/* 主内容区 */}
      <main>
        {step === "config" && <ConfigPanel ... />}
        {step === "task_generating" && <TaskGeneratingPanel ... />}
        {step === "task_review" && <TaskReviewPanel ... />}
        {step === "code_generating" && <CodeGeneratingPanel ... />}
        {step === "complete" && <CompletePanel ... />}
      </main>

      {/* 日志抽屉（复用现有 LogDrawer 组件）*/}
      <LogDrawer logs={projectState.logs} />
    </div>
  );
}
```

**Chapter 进度组件（Step 2 左侧）：**
```typescript
const SECTION_NAMES = {
  cover: "封面信息",
  objectives: "背景与目标",
  modules: "模块概述",
  details: "设计内容",
  requirements: "作业要求",
  deliverables: "提交成果",
  grading: "成绩考核",
  schedule: "时间安排",
  references: "参考资源"
};

function ChapterProgress({ sections, currentSection }) {
  return (
    <ul>
      {Object.entries(SECTION_NAMES).map(([key, name]) => (
        <li key={key} className={cn(
          "flex items-center gap-2",
          sections[key] ? "text-green-500" : key === currentSection ? "text-blue-500 animate-pulse" : "text-gray-400"
        )}>
          {sections[key] ? <CheckCircle /> : key === currentSection ? <Loader2 className="animate-spin" /> : <Circle />}
          {name}
        </li>
      ))}
    </ul>
  );
}
```

---

## Phase 3：后端 — 代码仓库生成

### 3.1 Claude Agent SDK 集成 `src/agents/project/agents/code_generator.py`

**依赖安装（需加入 requirements.txt）：**
```
claude-agent-sdk>=0.1.0
```

**新增环境变量（.env）：**
```
ANTHROPIC_API_KEY=sk-ant-xxx    # Claude Agent SDK 需要（独立于 DashScope）
```

**代码实现：**
```python
import asyncio
import json
import os
from pathlib import Path
from typing import AsyncGenerator, Callable

class CodeGenerator:
    """
    调用 Claude Agent SDK 生成项目代码仓库
    优先使用 claude-agent-sdk，降级到 claude CLI subprocess
    """

    def __init__(self, anthropic_api_key: str | None = None):
        self.api_key = anthropic_api_key or os.getenv("ANTHROPIC_API_KEY")

    async def generate(
        self,
        task_document: str,
        output_dir: str,
        ws_callback: Callable
    ) -> dict:
        """生成代码仓库，流式推送进度"""
        repo_dir = Path(output_dir) / "repo"
        repo_dir.mkdir(parents=True, exist_ok=True)

        # 构建代码生成提示词
        prompt = self._build_prompt(task_document)

        try:
            # 方案A：claude-agent-sdk
            from claude_agent_sdk import query, ClaudeAgentOptions
            async for message in query(
                prompt=prompt,
                options=ClaudeAgentOptions(
                    allowed_tools=["Read", "Write", "Edit", "Bash", "Glob"],
                    working_directory=str(repo_dir),
                )
            ):
                await self._handle_sdk_message(message, ws_callback)

        except ImportError:
            # 方案B：claude CLI subprocess
            await self._generate_via_cli(prompt, str(repo_dir), ws_callback)

        # 收集生成的文件树
        file_tree = self._build_file_tree(repo_dir)
        return {"repo_path": str(repo_dir), "file_tree": file_tree}

    async def _generate_via_cli(self, prompt: str, cwd: str, ws_callback: Callable):
        """通过 subprocess 调用 claude CLI（stream-json 模式）"""
        process = await asyncio.create_subprocess_exec(
            "claude", "-p", prompt,
            "--allowedTools", "Bash,Read,Write,Edit,Glob",
            "--output-format", "stream-json",
            cwd=cwd,
            env={**os.environ, "ANTHROPIC_API_KEY": self.api_key},
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        async for line in process.stdout:
            line_str = line.decode().strip()
            if not line_str:
                continue
            try:
                event = json.loads(line_str)
                await self._handle_cli_event(event, ws_callback)
            except json.JSONDecodeError:
                pass

        await process.wait()

    async def _handle_sdk_message(self, message, ws_callback):
        """处理 claude-agent-sdk 的消息，转换为前端格式"""
        # 工具调用日志
        if hasattr(message, "tool_use"):
            await ws_callback({
                "type": "agent_log",
                "log_type": "tool_use",
                "tool": message.tool_use.name,
                "path": message.tool_use.input.get("path", ""),
                "content": f"使用工具: {message.tool_use.name}"
            })
        # 文件变更通知
        if hasattr(message, "tool_result"):
            if message.tool_use.name in ["Write", "Edit"]:
                await ws_callback({
                    "type": "file_created",
                    "path": message.tool_use.input.get("path", "")
                })

    def _build_prompt(self, task_document: str) -> str:
        return f"""请根据以下任务书，创建一个完整的项目代码仓库：

{task_document}

要求：
1. 首先 git init 初始化仓库
2. 创建清晰的项目目录结构
3. 编写 README.md（包含项目说明、安装步骤、使用方法）
4. 生成主要功能模块的骨架代码（带注释）
5. 创建 requirements.txt 或对应的依赖文件
6. 代码结构清晰，符合该技术栈的最佳实践
"""

    def _build_file_tree(self, base_dir: Path) -> list:
        """递归构建文件树（排除 .git 目录）"""
        result = []
        for item in sorted(base_dir.iterdir()):
            if item.name == ".git":
                continue
            node = {"name": item.name, "path": str(item.relative_to(base_dir)), "type": "directory" if item.is_dir() else "file"}
            if item.is_dir():
                node["children"] = self._build_file_tree(item)
            result.append(node)
        return result
```

### 3.2 generate-code WebSocket 端点

```python
@router.websocket("/project/generate-code")
async def websocket_generate_code(websocket: WebSocket):
    await websocket.accept()
    log_queue = asyncio.Queue()

    try:
        data = await websocket.receive_json()
        session_id = data.get("session_id")
        task_content = data.get("task_content", "")

        session_mgr = ProjectSessionManager()
        session = session_mgr.get_session(session_id)
        output_dir = get_project_output_dir(session_id)

        # 更新状态
        session_mgr.update_session(session_id, status="code_generating")
        await websocket.send_json({"type": "status", "content": "正在初始化 Claude Agent SDK..."})

        # 检查 ANTHROPIC_API_KEY
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            await websocket.send_json({"type": "error", "content": "未配置 ANTHROPIC_API_KEY，请在 .env 中添加"})
            return

        # 创建 CodeGenerator
        generator = CodeGenerator(anthropic_api_key=api_key)

        async def ws_callback(msg: dict):
            await log_queue.put(msg)

        # 启动日志推送
        pusher_task = asyncio.create_task(log_pusher(log_queue, websocket))

        # 执行代码生成
        result = await generator.generate(
            task_document=task_content,
            output_dir=str(output_dir),
            ws_callback=ws_callback
        )

        await log_queue.put(None)
        await pusher_task

        session_mgr.update_session(session_id, status="complete", repo_path=result["repo_path"])
        await websocket.send_json({
            "type": "complete",
            "repo_path": result["repo_path"],
            "file_tree": result["file_tree"]
        })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"type": "error", "content": str(e)})
```

---

## Phase 4：前端 — 代码生成 UI

### 4.1 AgentLog 组件

```typescript
// Agent 操作日志条目
function AgentLogEntry({ entry }: { entry: AgentLogEntry }) {
  const icons = { Write: "📝", Edit: "✏️", Bash: "⚡", Read: "📖", Glob: "🔍" };
  return (
    <div className="flex items-start gap-2 text-sm font-mono py-1">
      <span className="text-gray-400 text-xs">{entry.timestamp}</span>
      <span>{icons[entry.tool] || "🔧"}</span>
      <span className={cn("font-semibold", entry.type === "error" ? "text-red-400" : "text-blue-400")}>
        {entry.tool}
      </span>
      {entry.path && <span className="text-gray-300 truncate">{entry.path}</span>}
    </div>
  );
}
```

### 4.2 文件树组件

```typescript
function FileTree({ nodes }: { nodes: FileTreeNode[] }) {
  return (
    <ul className="text-sm font-mono">
      {nodes.map(node => (
        <li key={node.path}>
          <div className="flex items-center gap-1 py-0.5 hover:bg-gray-100">
            {node.type === "directory" ? <FolderIcon /> : <FileIcon />}
            <span>{node.name}</span>
          </div>
          {node.children && <ul className="pl-4"><FileTree nodes={node.children} /></ul>}
        </li>
      ))}
    </ul>
  );
}
```

### 4.3 GlobalContext 中的 startCodeGeneration

```typescript
const startCodeGeneration = () => {
  if (projectWs.current) projectWs.current.close();
  setProjectState(prev => ({ ...prev, step: "code_generating", agentLogs: [], generatedFiles: [] }));

  const ws = new WebSocket(wsUrl("/api/v1/project/generate-code"));
  projectWs.current = ws;

  ws.onopen = () => {
    ws.send(JSON.stringify({
      session_id: projectState.sessionId,
      task_content: projectState.taskContent
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "agent_log":
        setProjectState(prev => ({ ...prev, agentLogs: [...prev.agentLogs, { ...data, timestamp: new Date().toLocaleTimeString() }] }));
        break;
      case "file_created":
        // 增量更新文件树（通过重新请求或维护本地状态）
        break;
      case "complete":
        setProjectState(prev => ({ ...prev, step: "complete", repoPath: data.repo_path, generatedFiles: data.file_tree }));
        break;
      case "error":
        setProjectState(prev => ({ ...prev, step: "task_review", error: data.content }));
        break;
    }
  };
};
```

---

## Phase 5：集成测试

### 5.1 后端单元测试

```python
# tests/test_project_task_generator.py
async def test_task_generator_structure():
    """验证生成的任务书包含所有 9 个章节"""

async def test_task_parser_docx():
    """验证 .docx 解析正确提取章节结构"""

async def test_code_generator_sdk_fallback():
    """验证 SDK 不可用时降级到 CLI"""
```

### 5.2 端到端测试步骤

1. 上传 `book/嵌入式开发暑期实习任务书.docx`，主题设为 `ROS 机器人导航实习`
2. 选择知识库 `raspberry_pi_cookbook`，开启 Web Search
3. 点击生成，观察 9 个章节逐步出现，Markdown 实时渲染
4. 下载 `.md` 和 `.docx`，检查格式与结构
5. 点击"生成代码仓库"，观察 Agent 日志（git init、文件写入等）
6. 验证 `data/user/projects/{id}/repo/` 下生成 README.md、src/ 目录等
7. 在前端文件树中确认所有文件显示正确

---

## 实现优先级与顺序

| 顺序 | 任务 | 预期耗时 | 依赖 |
|------|------|---------|------|
| 1 | task_parser.py | - | python-docx |
| 2 | project.py (upload-reference) | - | task_parser |
| 3 | task_generator.py (基础版，无流式) | - | 现有 LLM |
| 4 | project.py (generate-task WebSocket) | - | task_generator |
| 5 | session_manager.py | - | - |
| 6 | main.py 注册路由 | - | project.py |
| 7 | Sidebar.tsx 添加菜单 | - | - |
| 8 | GlobalContext.tsx 添加 state | - | - |
| 9 | project/page.tsx (Step 1-3) | - | 后端 Phase 1 |
| 10 | task_generator.py 改为流式输出 | - | 基础版完成 |
| 11 | 添加 RAG + Web Search | - | 流式版完成 |
| 12 | ANTHROPIC_API_KEY 配置 | - | - |
| 13 | code_generator.py | - | claude-agent-sdk |
| 14 | project.py (generate-code WebSocket) | - | code_generator |
| 15 | project/page.tsx (Step 4) | - | 后端 Phase 3 |
| 16 | 端到端集成测试 | - | 全部完成 |

---

## 前置依赖清单

```bash
# Python（deeptutor 环境）
pip install claude-agent-sdk    # Claude Agent SDK
# python-docx 已安装（deeptutor 环境）

# 环境变量（.env 新增）
ANTHROPIC_API_KEY=sk-ant-xxx    # 代码生成需要

# Claude CLI（可选降级方案）
npm install -g @anthropic-ai/claude-code
```

---

## 关键文件路径速查

| 文件 | 路径 | 操作 |
|------|------|------|
| 路由 | `src/api/routers/project.py` | 新建 |
| 协调器 | `src/agents/project/coordinator.py` | 新建 |
| 文档解析 | `src/agents/project/agents/task_parser.py` | 新建 |
| 任务书生成 | `src/agents/project/agents/task_generator.py` | 新建 |
| 代码生成 | `src/agents/project/agents/code_generator.py` | 新建 |
| 会话管理 | `src/agents/project/session_manager.py` | 新建 |
| 路由注册 | `src/api/main.py` | 修改 ~L195 |
| 侧边栏 | `web/components/Sidebar.tsx` | 修改 L42-53, L8-28 |
| 全局状态 | `web/context/GlobalContext.tsx` | 修改 多处 |
| 前端页面 | `web/app/project/page.tsx` | 新建 |
| 提示词(中) | `src/agents/project/prompts/zh/*.yaml` | 新建 |
| 参考路由 | `src/api/routers/question.py` | 只读参考 |
| 参考 Agent | `src/agents/question/coordinator.py` | 只读参考 |
| 参考会话 | `src/agents/solve/session_manager.py` | 只读参考 |
| 参考页面 | `web/app/question/page.tsx` | 只读参考 |
