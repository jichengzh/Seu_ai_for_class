import { test, expect, type Page } from "@playwright/test";

// ─── Existing tests (Step 1) ─────────────────────────────────────────────────

test.describe("Project Creator", () => {
  test("sidebar shows Project Creator link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Project Creator")).toBeVisible({ timeout: 10000 });
  });

  test("navigates to /project page", async ({ page }) => {
    await page.goto("/project");
    await expect(page).toHaveURL("/project");
    await expect(page.getByRole("heading", { name: /Project Creator/i })).toBeVisible();
  });

  test("step 1 renders config form", async ({ page }) => {
    await page.goto("/project");
    await expect(page.getByText(/上传参考任务书/)).toBeVisible();
    await expect(page.getByPlaceholder(/ROS 机器人导航/)).toBeVisible();
  });

  test("start button disabled when theme is empty", async ({ page }) => {
    await page.goto("/project");
    const btn = page.getByRole("button", { name: /开始生成任务书/ });
    await expect(btn).toBeDisabled();
  });

  test("start button disabled without uploaded file", async ({ page }) => {
    await page.goto("/project");
    await page.getByPlaceholder(/ROS 机器人导航/).fill("测试主题");
    // No file uploaded → button still disabled
    const btn = page.getByRole("button", { name: /开始生成任务书/ });
    await expect(btn).toBeDisabled();
  });

  test("rejects non-docx/pdf file type", async ({ page }) => {
    await page.goto("/project");
    const fileInput = page.locator("input[type=file]");
    await fileInput.setInputFiles({
      name: "test.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("hello world"),
    });
    await expect(page.getByText(/仅支持 .docx 和 .pdf 格式/)).toBeVisible();
  });

  test("step indicator renders all 4 steps", async ({ page }) => {
    await page.goto("/project");
    await expect(page.getByText("配置")).toBeVisible();
    await expect(page.getByText("生成中")).toBeVisible();
    await expect(page.getByText("审阅")).toBeVisible();
    await expect(page.getByText("代码")).toBeVisible();
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function mockUploadReference(page: Page) {
  await page.route("**/api/v1/project/upload-reference", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        reference_id: "test-ref-id.docx",
        original_filename: "ref.docx",
        structure: { sections: { objectives: "目标内容", modules: "模块内容" } },
        structure_summary: "测试结构摘要",
        section_count: 2,
      }),
    }),
  );
}

async function mockKbList(page: Page) {
  await page.route("**/api/v1/knowledge/list", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ knowledge_bases: [{ name: "test_kb" }] }),
    }),
  );
}

const FAKE_DOCX = Buffer.from("PK\x03\x04 fake docx");

/** Upload a fake .docx file and fill in the theme. Waits for upload success indicator. */
async function fillStep1(page: Page, theme = "ROS 机器人导航实习") {
  await page.getByPlaceholder(/ROS 机器人导航/).fill(theme);
  const fileInput = page.locator("input[type=file]");
  await fileInput.setInputFiles({
    name: "ref.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    buffer: FAKE_DOCX,
  });
  // Wait for the upload success indicator ("已解析 2 个章节")
  await expect(page.getByText(/已解析.*章节/)).toBeVisible({ timeout: 6000 });
}

/** Reach task_review step by running full Step 1 + WS generate-task mock. */
async function reachTaskReview(page: Page, sessionId = "review-session-001") {
  await mockUploadReference(page);
  await mockKbList(page);
  await page.goto("/project");
  await fillStep1(page);

  await page.routeWebSocket("**/api/v1/project/generate-task", (ws) => {
    ws.onMessage(() => {
      ws.send(JSON.stringify({
        type: "complete",
        session_id: sessionId,
        task_md_path: "/tmp/task.md",
        task_content: "## 任务书完整内容\n\n这是生成的任务书正文。",
      }));
    });
  });

  await page.getByRole("button", { name: /开始生成任务书/ }).click();
  await expect(page.getByRole("button", { name: /下载 .md/ })).toBeVisible({ timeout: 8000 });
}

/** Reach complete step by running full Steps 1-3 + WS generate-code mock. */
async function reachCodeComplete(page: Page) {
  await reachTaskReview(page, "code-session-001");

  await page.routeWebSocket("**/api/v1/project/generate-code", (ws) => {
    ws.onMessage(() => {
      ws.send(JSON.stringify({ type: "phase", content: "阶段 B：规划中..." }));
      ws.send(JSON.stringify({ type: "agent_log", log_type: "tool_use", tool: "Write", path: "PLAN.md", content: "Write PLAN.md" }));
      ws.send(JSON.stringify({ type: "phase", content: "阶段 C：生成代码..." }));
      ws.send(JSON.stringify({ type: "agent_log", log_type: "tool_use", tool: "Write", path: "src/main.py", content: "Write src/main.py" }));
      ws.send(JSON.stringify({ type: "file_created", path: "src/main.py" }));
      ws.send(JSON.stringify({ type: "verify_result", passed: true, report: "所有检查通过" }));
      ws.send(JSON.stringify({ type: "coverage", map: { "module_1": ["src/main.py"] } }));
      ws.send(JSON.stringify({
        type: "complete",
        session_id: "code-session-001",
        repo_path: "/tmp/repo",
        file_tree: [
          { name: "src", path: "src", type: "directory", children: [{ name: "main.py", path: "src/main.py", type: "file" }] },
          { name: "README.md", path: "README.md", type: "file" },
        ],
        coverage_map: { "module_1": ["src/main.py"] },
        verify_passed: true,
      }));
    });
  });

  await page.getByRole("button", { name: /生成代码仓库/ }).click();
  // Wait for complete state (download button appears)
  await expect(page.getByRole("button", { name: /下载代码 zip/ })).toBeVisible({ timeout: 15000 });
}

// ─── Step 2: Task Generation ──────────────────────────────────────────────────

test.describe("Project Creator — Step 2 (任务书生成)", () => {
  test("上传成功后显示已解析章节数", async ({ page }) => {
    await mockUploadReference(page);
    await mockKbList(page);
    await page.goto("/project");
    await page.getByPlaceholder(/ROS 机器人导航/).fill("测试主题");
    const fileInput = page.locator("input[type=file]");
    await fileInput.setInputFiles({
      name: "ref.docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      buffer: FAKE_DOCX,
    });
    await expect(page.getByText(/已解析.*章节/)).toBeVisible({ timeout: 6000 });
    // Button enabled after upload
    await expect(page.getByRole("button", { name: /开始生成任务书/ })).toBeEnabled({ timeout: 3000 });
  });

  test("WS generate-task：流式 chunk 实时追加到 Markdown 预览", async ({ page }) => {
    await mockUploadReference(page);
    await mockKbList(page);
    await page.goto("/project");
    await fillStep1(page);

    await page.routeWebSocket("**/api/v1/project/generate-task", (ws) => {
      ws.onMessage(() => {
        ws.send(JSON.stringify({ type: "status", content: "正在生成..." }));
        ws.send(JSON.stringify({ type: "chunk", content: "## 一、课程背景\n" }));
        ws.send(JSON.stringify({ type: "chunk", content: "本实习旨在培养能力。\n" }));
        ws.send(JSON.stringify({ type: "section", section: "objectives", content: "## 一、课程背景\n本实习旨在培养能力。\n" }));
        ws.send(JSON.stringify({
          type: "complete",
          session_id: "stream-session-001",
          task_md_path: "/tmp/task.md",
          task_content: "## 一、课程背景\n本实习旨在培养能力。\n",
        }));
      });
    });

    await page.getByRole("button", { name: /开始生成任务书/ }).click();

    // Content streamed into preview
    await expect(page.getByText("课程背景")).toBeVisible({ timeout: 8000 });

    // Transitions to task_review
    await expect(page.getByRole("button", { name: /下载 .md/ })).toBeVisible({ timeout: 5000 });
  });

  test("WS error 回退到 Step 1 并显示错误信息", async ({ page }) => {
    await mockUploadReference(page);
    await mockKbList(page);
    await page.goto("/project");
    await fillStep1(page);

    await page.routeWebSocket("**/api/v1/project/generate-task", (ws) => {
      ws.onMessage(() => {
        ws.send(JSON.stringify({ type: "error", content: "LLM 超时，请重试" }));
      });
    });

    await page.getByRole("button", { name: /开始生成任务书/ }).click();
    await expect(page.getByText(/LLM 超时/)).toBeVisible({ timeout: 8000 });
    // Back to config step — generate button re-appears
    await expect(page.getByRole("button", { name: /开始生成任务书/ })).toBeVisible({ timeout: 5000 });
  });
});

// ─── Step 3: Task Review ──────────────────────────────────────────────────────

test.describe("Project Creator — Step 3 (任务书审阅)", () => {
  test("Step 3 显示任务书 Markdown 预览内容", async ({ page }) => {
    await reachTaskReview(page);
    await expect(page.getByText("任务书完整内容")).toBeVisible();
  });

  test("Step 3 显示下载 .md 和 .docx 按钮", async ({ page }) => {
    await reachTaskReview(page);
    await expect(page.getByRole("button", { name: /下载 .md/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /下载 .docx/ })).toBeVisible();
  });

  test("Step 3 显示并可点击'生成代码仓库'按钮", async ({ page }) => {
    await reachTaskReview(page);
    const btn = page.getByRole("button", { name: /生成代码仓库/ });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });
});

// ─── Step 4: Code Generation ──────────────────────────────────────────────────

test.describe("Project Creator — Step 4 (代码生成)", () => {
  test("Step 4 显示 Agent 操作日志面板", async ({ page }) => {
    await reachCodeComplete(page);
    await expect(page.getByText("Write")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("PLAN.md")).toBeVisible({ timeout: 5000 });
  });

  test("Step 4 文件树展示生成的文件", async ({ page }) => {
    await reachCodeComplete(page);
    await expect(page.getByText("README.md")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("main.py")).toBeVisible({ timeout: 5000 });
  });

  test("Step 4 验证通过时显示绿色状态栏", async ({ page }) => {
    await reachCodeComplete(page);
    await expect(page.getByText(/代码验证通过/)).toBeVisible({ timeout: 5000 });
  });

  test("Step 4 完成后显示下载 zip 按钮", async ({ page }) => {
    await reachCodeComplete(page);
    await expect(page.getByRole("button", { name: /下载代码 zip/ })).toBeVisible({ timeout: 5000 });
  });

  test("Step 4 完成后显示新建项目按钮", async ({ page }) => {
    await reachCodeComplete(page);
    await expect(page.getByRole("button", { name: /新建项目/ })).toBeVisible({ timeout: 5000 });
  });

  test("generate-code WS error → 回退到 task_review", async ({ page }) => {
    await mockUploadReference(page);
    await mockKbList(page);
    await page.goto("/project");
    await fillStep1(page);

    await page.routeWebSocket("**/api/v1/project/generate-task", (ws) => {
      ws.onMessage(() => {
        ws.send(JSON.stringify({ type: "complete", session_id: "err-session-001", task_md_path: "/tmp/task.md", task_content: "## 任务书" }));
      });
    });

    await page.getByRole("button", { name: /开始生成任务书/ }).click();
    await expect(page.getByRole("button", { name: /生成代码仓库/ })).toBeVisible({ timeout: 8000 });

    await page.routeWebSocket("**/api/v1/project/generate-code", (ws) => {
      ws.onMessage(() => {
        ws.send(JSON.stringify({ type: "error", content: "claude CLI 未找到" }));
      });
    });

    await page.getByRole("button", { name: /生成代码仓库/ }).click();
    // Error shown in banner
    await expect(page.getByText(/claude CLI 未找到/)).toBeVisible({ timeout: 8000 });
    // Reverted to task_review
    await expect(page.getByRole("button", { name: /生成代码仓库/ })).toBeVisible({ timeout: 5000 });
  });
});

// ─── History page ─────────────────────────────────────────────────────────────

test.describe("Project History", () => {
  test("navigates to /project/history", async ({ page }) => {
    await page.route("**/api/v1/project/sessions*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ sessions: [], total: 0 }),
      }),
    );
    await page.goto("/project/history");
    await expect(page).toHaveURL("/project/history");
  });

  test("empty history shows placeholder text", async ({ page }) => {
    await page.route("**/api/v1/project/sessions*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ sessions: [], total: 0 }),
      }),
    );
    await page.goto("/project/history");
    await expect(page.getByText(/暂无历史项目/)).toBeVisible({ timeout: 5000 });
  });

  test("history page lists sessions from API", async ({ page }) => {
    await page.route("**/api/v1/project/sessions*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          sessions: [
            {
              session_id: "proj_test_001",
              theme: "ROS 机器人导航实习",
              status: "complete",
              created_at: 1700000000,
              updated_at: 1700000100,
              task_md_path: "/tmp/task.md",
              repo_path: "/tmp/repo",
            },
          ],
          total: 1,
        }),
      }),
    );
    await page.goto("/project/history");
    await expect(page.getByText("ROS 机器人导航实习")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("已完成")).toBeVisible({ timeout: 5000 });
  });
});
