module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API configuration and utility functions
// Get API base URL from environment variable
// This is automatically set by start_web.py based on config/main.yaml
// The .env.local file is auto-generated on startup with the correct backend port
__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "apiUrl",
    ()=>apiUrl,
    "wsUrl",
    ()=>wsUrl
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:8001") || (()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // No fallback - port must be configured in config/main.yaml
    throw new Error("NEXT_PUBLIC_API_BASE is not configured. Please set server ports in config/main.yaml and restart.");
})();
function apiUrl(path) {
    // Remove leading slash if present to avoid double slashes
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    // Remove trailing slash from base URL if present
    const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${base}${normalizedPath}`;
}
function wsUrl(path) {
    // Security Hardening: Convert http to ws and https to wss.
    // In production environments (where API_BASE_URL starts with https), this ensures secure websockets.
    const base = API_BASE_URL.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
    // Remove leading slash if present to avoid double slashes
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    // Remove trailing slash from base URL if present
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${normalizedBase}${normalizedPath}`;
}
}),
"[project]/lib/theme.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Theme persistence utilities
 * Handles light/dark theme with localStorage fallback and system preference detection
 */ __turbopack_context__.s([
    "THEME_STORAGE_KEY",
    ()=>THEME_STORAGE_KEY,
    "applyThemeToDocument",
    ()=>applyThemeToDocument,
    "getStoredTheme",
    ()=>getStoredTheme,
    "getSystemTheme",
    ()=>getSystemTheme,
    "initializeTheme",
    ()=>initializeTheme,
    "saveThemeToStorage",
    ()=>saveThemeToStorage,
    "setTheme",
    ()=>setTheme,
    "subscribeToThemeChanges",
    ()=>subscribeToThemeChanges
]);
const THEME_STORAGE_KEY = "deeptutor-theme";
const themeListeners = new Set();
function subscribeToThemeChanges(listener) {
    themeListeners.add(listener);
    return ()=>themeListeners.delete(listener);
}
/**
 * Notify all listeners of theme change
 */ function notifyThemeChange(theme) {
    themeListeners.forEach((listener)=>listener(theme));
}
function getStoredTheme() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function saveThemeToStorage(theme) {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
function getSystemTheme() {
    if ("TURBOPACK compile-time truthy", 1) return "light";
    //TURBOPACK unreachable
    ;
}
function applyThemeToDocument(theme) {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    if (theme === "dark") {
        html.classList.add("dark");
    } else {
        html.classList.remove("dark");
    }
}
function initializeTheme() {
    // Check localStorage first
    const stored = getStoredTheme();
    if (stored) {
        applyThemeToDocument(stored);
        return stored;
    }
    // Fall back to system preference
    const systemTheme = getSystemTheme();
    applyThemeToDocument(systemTheme);
    saveThemeToStorage(systemTheme);
    return systemTheme;
}
function setTheme(theme) {
    applyThemeToDocument(theme);
    saveThemeToStorage(theme);
    notifyThemeChange(theme);
}
}),
"[project]/lib/persistence.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EXCLUDE_FIELDS",
    ()=>EXCLUDE_FIELDS,
    "STORAGE_KEYS",
    ()=>STORAGE_KEYS,
    "clearAllStorage",
    ()=>clearAllStorage,
    "getStorageStats",
    ()=>getStorageStats,
    "loadFromStorage",
    ()=>loadFromStorage,
    "mergeWithDefaults",
    ()=>mergeWithDefaults,
    "persistState",
    ()=>persistState,
    "removeFromStorage",
    ()=>removeFromStorage,
    "saveToStorage",
    ()=>saveToStorage
]);
/**
 * Persistence utility library for localStorage operations
 * Provides safe read/write operations with error handling, versioning, and selective persistence
 */ // Storage key prefix to avoid conflicts with other apps
const STORAGE_PREFIX = "deeptutor_";
// Current storage version for data migration support
const STORAGE_VERSION = 1;
// Version key suffix
const VERSION_SUFFIX = "_version";
function loadFromStorage(key, defaultValue) {
    if ("TURBOPACK compile-time truthy", 1) {
        return defaultValue;
    }
    //TURBOPACK unreachable
    ;
}
function saveToStorage(key, value) {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function removeFromStorage(key) {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function clearAllStorage() {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function persistState(state, exclude) {
    const result = {};
    for (const key of Object.keys(state)){
        if (!exclude.includes(key)) {
            result[key] = state[key];
        }
    }
    return result;
}
function mergeWithDefaults(persistedState, defaultState, exclude = []) {
    if (!persistedState) {
        return defaultState;
    }
    const result = {
        ...defaultState
    };
    for (const key of Object.keys(persistedState)){
        // Skip excluded fields - always use defaults
        if (exclude.includes(key)) {
            continue;
        }
        // Only copy if value is not undefined
        if (persistedState[key] !== undefined) {
            result[key] = persistedState[key];
        }
    }
    return result;
}
function getStorageStats() {
    if ("TURBOPACK compile-time truthy", 1) {
        return {
            totalSize: 0,
            items: []
        };
    }
    //TURBOPACK unreachable
    ;
    const items = undefined;
    let totalSize;
}
const STORAGE_KEYS = {
    CHAT_STATE: "chat_state",
    SOLVER_STATE: "solver_state",
    QUESTION_STATE: "question_state",
    RESEARCH_STATE: "research_state",
    IDEAGEN_STATE: "ideagen_state",
    GUIDE_SESSION: "guide_session",
    COWRITER_CONTENT: "cowriter_content"
};
const EXCLUDE_FIELDS = {
    CHAT: [
        "isLoading",
        "currentStage"
    ],
    SOLVER: [
        "isSolving",
        "logs",
        "agentStatus",
        "tokenStats",
        "progress"
    ],
    QUESTION: [
        "logs",
        "progress",
        "agentStatus",
        "tokenStats",
        "uploadedFile"
    ],
    RESEARCH: [
        "status",
        "logs",
        "progress"
    ],
    IDEAGEN: [
        "isGenerating",
        "progress"
    ],
    GUIDE: [
        "isLoading",
        "loadingMessage"
    ]
};
}),
"[project]/lib/debounce.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Debounce utility
 * Delays function execution until after wait milliseconds have elapsed since the last call
 */ __turbopack_context__.s([
    "debounce",
    ()=>debounce
]);
function debounce(func, wait) {
    let timeout = null;
    return function executedFunction(...args) {
        const later = ()=>{
            timeout = null;
            func(...args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}
}),
"[project]/context/GlobalContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlobalProvider",
    ()=>GlobalProvider,
    "useGlobal",
    ()=>useGlobal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/theme.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/persistence.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/debounce.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
// Language storage key
const LANGUAGE_STORAGE_KEY = "deeptutor-language";
const GlobalContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
// --- Default State Constants ---
// These are used for both initialization and state restoration
const DEFAULT_SOLVER_STATE = {
    sessionId: null,
    isSolving: false,
    logs: [],
    messages: [],
    question: "",
    selectedKb: "",
    agentStatus: {
        InvestigateAgent: "pending",
        NoteAgent: "pending",
        ManagerAgent: "pending",
        SolveAgent: "pending",
        ToolAgent: "pending",
        ResponseAgent: "pending",
        PrecisionAnswerAgent: "pending"
    },
    tokenStats: {
        model: "Unknown",
        calls: 0,
        tokens: 0,
        input_tokens: 0,
        output_tokens: 0,
        cost: 0.0
    },
    progress: {
        stage: null,
        progress: {}
    }
};
const DEFAULT_QUESTION_STATE = {
    step: "config",
    mode: "knowledge",
    logs: [],
    results: [],
    topic: "",
    difficulty: "medium",
    type: "choice",
    count: 1,
    selectedKb: "",
    progress: {
        stage: null,
        progress: {},
        subFocuses: [],
        activeQuestions: [],
        completedQuestions: 0,
        failedQuestions: 0
    },
    agentStatus: {
        QuestionGenerationAgent: "pending",
        ValidationWorkflow: "pending",
        RetrievalTool: "pending"
    },
    tokenStats: {
        model: "Unknown",
        calls: 0,
        tokens: 0,
        input_tokens: 0,
        output_tokens: 0,
        cost: 0.0
    },
    uploadedFile: null,
    paperPath: ""
};
const DEFAULT_RESEARCH_STATE = {
    status: "idle",
    logs: [],
    report: null,
    topic: "",
    selectedKb: "",
    progress: {
        stage: null,
        status: "",
        executionMode: undefined,
        totalBlocks: undefined,
        currentBlock: undefined,
        currentSubTopic: undefined,
        currentBlockId: undefined,
        iterations: undefined,
        maxIterations: undefined,
        toolsUsed: undefined,
        currentTool: undefined,
        currentQuery: undefined,
        currentRationale: undefined,
        queriesUsed: undefined,
        activeTasks: undefined,
        activeCount: undefined,
        completedCount: undefined,
        keptBlocks: undefined,
        sections: undefined,
        wordCount: undefined,
        citations: undefined
    }
};
const DEFAULT_IDEAGEN_STATE = {
    isGenerating: false,
    generationStatus: "",
    generatedIdeas: [],
    progress: null
};
const DEFAULT_CHAT_STATE = {
    sessionId: null,
    messages: [],
    isLoading: false,
    selectedKb: "",
    enableRag: false,
    enableWebSearch: false,
    currentStage: null
};
function GlobalProvider({ children }) {
    // --- UI Settings Logic ---
    const [uiSettings, setUiSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        theme: "light",
        language: "en"
    });
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const refreshSettings = async ()=>{
        // Try to load from backend API first, fallback to localStorage
        try {
            const res = await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiUrl"])("/api/v1/settings"));
            if (res.ok) {
                const data = await res.json();
                const serverTheme = data.ui?.theme || "light";
                const serverLanguage = data.ui?.language || "en";
                setUiSettings({
                    theme: serverTheme,
                    language: serverLanguage
                });
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setTheme"])(serverTheme);
                // Sync to localStorage as cache
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                return;
            }
        } catch (e) {
            console.warn("Failed to load settings from server, using localStorage:", e);
        }
        // Fallback to localStorage
        const storedTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoredTheme"])();
        const storedLanguage = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "en";
        const themeToUse = storedTheme || "light";
        setUiSettings({
            theme: themeToUse,
            language: storedLanguage
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setTheme"])(themeToUse);
    };
    const updateTheme = async (newTheme)=>{
        // Update UI immediately
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setTheme"])(newTheme);
        setUiSettings((prev)=>({
                ...prev,
                theme: newTheme
            }));
        // Persist to backend
        try {
            await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiUrl"])("/api/v1/settings/theme"), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    theme: newTheme
                })
            });
        } catch (e) {
            console.warn("Failed to save theme to server:", e);
        }
    };
    const updateLanguage = async (newLanguage)=>{
        // Update UI immediately
        setUiSettings((prev)=>({
                ...prev,
                language: newLanguage
            }));
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Persist to backend
        try {
            await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiUrl"])("/api/v1/settings/language"), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    language: newLanguage
                })
            });
        } catch (e) {
            console.warn("Failed to save language to server:", e);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Initialize settings on first render
        if (!isInitialized) {
            // First apply localStorage theme immediately to avoid flash
            const initialTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$theme$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeTheme"])();
            const storedLanguage = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "en";
            setUiSettings({
                theme: initialTheme,
                language: storedLanguage
            });
            setIsInitialized(true);
            // Then async load from server (which may override)
            refreshSettings();
        }
    }, [
        isInitialized
    ]);
    // --- Sidebar State ---
    const SIDEBAR_MIN_WIDTH = 64;
    const SIDEBAR_MAX_WIDTH = 320;
    const SIDEBAR_DEFAULT_WIDTH = 256;
    const SIDEBAR_COLLAPSED_WIDTH = 64;
    const [sidebarWidth, setSidebarWidthState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(SIDEBAR_DEFAULT_WIDTH);
    const [sidebarCollapsed, setSidebarCollapsedState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Initialize sidebar state from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    const setSidebarWidth = (width)=>{
        const clampedWidth = Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, width));
        setSidebarWidthState(clampedWidth);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    };
    const setSidebarCollapsed = (collapsed)=>{
        setSidebarCollapsedState(collapsed);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    };
    const toggleSidebar = ()=>{
        setSidebarCollapsed(!sidebarCollapsed);
    };
    // --- Sidebar Customization State ---
    const DEFAULT_DESCRIPTION = "✨ Data Intelligence Lab @ HKU";
    const DEFAULT_NAV_ORDER = {
        start: [
            "/",
            "/history",
            "/knowledge",
            "/notebook"
        ],
        learnResearch: [
            "/question",
            "/solver",
            "/guide",
            "/ideagen",
            "/research",
            "/co_writer"
        ]
    };
    const [sidebarDescription, setSidebarDescriptionState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_DESCRIPTION);
    const [sidebarNavOrder, setSidebarNavOrderState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_NAV_ORDER);
    // Initialize sidebar customization from backend API
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadSidebarSettings = async ()=>{
            try {
                const response = await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiUrl"])("/api/v1/settings/sidebar"));
                if (response.ok) {
                    const data = await response.json();
                    if (data.description) {
                        setSidebarDescriptionState(data.description);
                    }
                    if (data.nav_order) {
                        setSidebarNavOrderState(data.nav_order);
                    }
                }
            } catch (e) {
                console.error("Failed to load sidebar settings from backend:", e);
            }
        };
        loadSidebarSettings();
    }, []);
    const setSidebarDescription = async (description)=>{
        setSidebarDescriptionState(description);
        // Save to backend
        try {
            await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiUrl"])("/api/v1/settings/sidebar/description"), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description
                })
            });
        } catch (e) {
            console.error("Failed to save sidebar description:", e);
        }
    };
    const setSidebarNavOrder = async (order)=>{
        setSidebarNavOrderState(order);
        // Save to backend
        try {
            await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiUrl"])("/api/v1/settings/sidebar/nav-order"), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nav_order: order
                })
            });
        } catch (e) {
            console.error("Failed to save sidebar nav order:", e);
        }
    };
    // --- Hydration tracking for persistence ---
    // We need to restore state from localStorage AFTER hydration to avoid SSR mismatch
    const isHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // --- Solver Logic ---
    const [solverState, setSolverState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SOLVER_STATE);
    const solverWs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Debounced save for solver state
    const saveSolverState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["debounce"])((state)=>{
        if (!isHydrated.current) return;
        const toSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistState"])(state, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXCLUDE_FIELDS"].SOLVER);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveToStorage"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].SOLVER_STATE, toSave);
    }, 500), []);
    // Auto-save solver state on change (only after hydration)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isHydrated.current) {
            saveSolverState(solverState);
        }
    }, [
        solverState,
        saveSolverState
    ]);
    // Use ref to always have the latest sessionId in WebSocket callbacks
    const solverSessionIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startSolver = (question, kb)=>{
        if (solverWs.current) solverWs.current.close();
        setSolverState((prev)=>({
                ...prev,
                isSolving: true,
                logs: [],
                messages: [
                    ...prev.messages,
                    {
                        role: "user",
                        content: question
                    }
                ],
                question,
                selectedKb: kb,
                agentStatus: {
                    InvestigateAgent: "pending",
                    NoteAgent: "pending",
                    ManagerAgent: "pending",
                    SolveAgent: "pending",
                    ToolAgent: "pending",
                    ResponseAgent: "pending",
                    PrecisionAnswerAgent: "pending"
                },
                tokenStats: {
                    model: "Unknown",
                    calls: 0,
                    tokens: 0,
                    input_tokens: 0,
                    output_tokens: 0,
                    cost: 0.0
                },
                progress: {
                    stage: null,
                    progress: {}
                }
            }));
        const ws = new WebSocket((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wsUrl"])("/api/v1/solve"));
        solverWs.current = ws;
        ws.onopen = ()=>{
            // Send question with current session_id (if any)
            ws.send(JSON.stringify({
                question,
                kb_name: kb,
                session_id: solverSessionIdRef.current
            }));
            addSolverLog({
                type: "system",
                content: "Initializing connection..."
            });
        };
        ws.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if (data.type === "session") {
                // Update session ID from backend
                solverSessionIdRef.current = data.session_id;
                setSolverState((prev)=>({
                        ...prev,
                        sessionId: data.session_id
                    }));
            } else if (data.type === "log") {
                addSolverLog(data);
            } else if (data.type === "agent_status") {
                setSolverState((prev)=>({
                        ...prev,
                        agentStatus: data.all_agents || {
                            ...prev.agentStatus,
                            [data.agent]: data.status
                        }
                    }));
            } else if (data.type === "token_stats") {
                setSolverState((prev)=>({
                        ...prev,
                        tokenStats: data.stats || prev.tokenStats
                    }));
            } else if (data.type === "progress") {
                setSolverState((prev)=>({
                        ...prev,
                        progress: {
                            stage: data.stage,
                            progress: data.progress || {}
                        }
                    }));
            } else if (data.type === "result") {
                // Use output_dir_name from backend if available, otherwise extract from output_dir
                let dirName = data.output_dir_name || "";
                if (!dirName && data.output_dir) {
                    const parts = data.output_dir.split(/[/\\]/);
                    dirName = parts[parts.length - 1];
                }
                setSolverState((prev)=>({
                        ...prev,
                        sessionId: data.session_id || prev.sessionId,
                        messages: [
                            ...prev.messages,
                            {
                                role: "assistant",
                                content: data.final_answer,
                                outputDir: dirName
                            }
                        ],
                        isSolving: false
                    }));
                ws.close();
            } else if (data.type === "error") {
                addSolverLog({
                    type: "error",
                    content: `Error: ${data.content || data.message || "Unknown error"}`
                });
                setSolverState((prev)=>({
                        ...prev,
                        isSolving: false
                    }));
            }
        };
        ws.onerror = ()=>{
            addSolverLog({
                type: "error",
                content: "Connection error"
            });
            setSolverState((prev)=>({
                    ...prev,
                    isSolving: false,
                    agentStatus: {
                        InvestigateAgent: "error",
                        NoteAgent: "error",
                        ManagerAgent: "error",
                        SolveAgent: "error",
                        ToolAgent: "error",
                        ResponseAgent: "error",
                        PrecisionAnswerAgent: "error"
                    },
                    progress: {
                        stage: null,
                        progress: {}
                    }
                }));
        };
        ws.onclose = ()=>{
            // Clean up WebSocket reference on close
            if (solverWs.current === ws) {
                solverWs.current = null;
            }
        };
    };
    // Stop the current solving process
    const stopSolver = ()=>{
        if (solverWs.current) {
            // Close the WebSocket to signal cancellation to backend
            solverWs.current.close();
            solverWs.current = null;
        }
        // Reset solving state but keep logs for user reference if desired
        setSolverState((prev)=>({
                ...prev,
                isSolving: false
            }));
        addSolverLog({
            type: "system",
            content: "Solver stopped by user."
        });
    };
    // Start a new solver session (clear current state)
    const newSolverSession = ()=>{
        if (solverWs.current) {
            solverWs.current.close();
            solverWs.current = null;
        }
        solverSessionIdRef.current = null;
        setSolverState({
            ...DEFAULT_SOLVER_STATE,
            selectedKb: solverState.selectedKb
        });
    };
    // Load a solver session from history
    const loadSolverSession = async (sessionId)=>{
        try {
            const response = await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiUrl"])(`/api/v1/solve/sessions/${sessionId}`));
            if (!response.ok) {
                throw new Error("Session not found");
            }
            const session = await response.json();
            // Map session messages to ChatMessage format
            const messages = session.messages.map((msg)=>({
                    role: msg.role,
                    content: msg.content,
                    outputDir: msg.output_dir
                }));
            solverSessionIdRef.current = session.session_id;
            setSolverState((prev)=>({
                    ...prev,
                    sessionId: session.session_id,
                    messages,
                    selectedKb: session.kb_name || prev.selectedKb,
                    tokenStats: session.token_stats || prev.tokenStats,
                    question: messages.length > 0 && messages[0].role === "user" ? messages[0].content : "",
                    isSolving: false,
                    logs: [],
                    progress: {
                        stage: null,
                        progress: {}
                    }
                }));
        } catch (error) {
            console.error("Failed to load solver session:", error);
            throw error;
        }
    };
    const addSolverLog = (log)=>{
        setSolverState((prev)=>({
                ...prev,
                logs: [
                    ...prev.logs,
                    log
                ]
            }));
    };
    // --- Question Logic ---
    const [questionState, setQuestionState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_QUESTION_STATE);
    const questionWs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Debounced save for question state
    const saveQuestionState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["debounce"])((state)=>{
        if (!isHydrated.current) return;
        const toSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistState"])(state, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXCLUDE_FIELDS"].QUESTION);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveToStorage"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].QUESTION_STATE, toSave);
    }, 500), []);
    // Auto-save question state on change (only after hydration)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isHydrated.current) {
            saveQuestionState(questionState);
        }
    }, [
        questionState,
        saveQuestionState
    ]);
    const startQuestionGen = (topic, diff, type, count, kb)=>{
        if (questionWs.current) questionWs.current.close();
        setQuestionState((prev)=>({
                ...prev,
                step: "generating",
                mode: "knowledge",
                logs: [],
                results: [],
                topic,
                difficulty: diff,
                type,
                count,
                selectedKb: kb,
                progress: {
                    stage: count > 1 ? "planning" : "generating",
                    progress: {
                        current: 0,
                        total: count
                    },
                    subFocuses: [],
                    activeQuestions: [],
                    completedQuestions: 0,
                    failedQuestions: 0
                },
                agentStatus: {
                    QuestionGenerationAgent: "pending",
                    ValidationWorkflow: "pending",
                    RetrievalTool: "pending"
                },
                tokenStats: {
                    model: "Unknown",
                    calls: 0,
                    tokens: 0,
                    input_tokens: 0,
                    output_tokens: 0,
                    cost: 0.0
                }
            }));
        const ws = new WebSocket((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wsUrl"])("/api/v1/question/generate"));
        questionWs.current = ws;
        ws.onopen = ()=>{
            ws.send(JSON.stringify({
                requirement: {
                    knowledge_point: topic,
                    difficulty: diff,
                    question_type: type,
                    additional_requirements: "Ensure clarity and academic rigor."
                },
                count: count,
                kb_name: kb
            }));
            addQuestionLog({
                type: "system",
                content: "Initializing Generator..."
            });
        };
        ws.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if (data.type === "log") {
                addQuestionLog(data);
                // Parse progress info from log content (fallback for any remaining print statements)
                if (data.content.includes("Generating question")) {
                    const match = data.content.match(/(\d+)\/(\d+)/);
                    if (match) {
                        setQuestionState((prev)=>({
                                ...prev,
                                progress: {
                                    stage: "generating",
                                    progress: {
                                        current: parseInt(match[1]),
                                        total: parseInt(match[2])
                                    }
                                }
                            }));
                    }
                }
                if (data.content.includes("Round") || data.content.includes("round")) {
                    const match = data.content.match(/Round\s+(\d+)/i);
                    if (match) {
                        setQuestionState((prev)=>({
                                ...prev,
                                progress: {
                                    ...prev.progress,
                                    progress: {
                                        ...prev.progress.progress,
                                        round: parseInt(match[1])
                                    }
                                }
                            }));
                    }
                }
                if (data.content.includes("Validation") || data.content.includes("validation")) {
                    setQuestionState((prev)=>({
                            ...prev,
                            progress: {
                                stage: "validating",
                                progress: prev.progress.progress
                            }
                        }));
                }
            } else if (data.type === "agent_status") {
                // Handle agent status updates
                setQuestionState((prev)=>({
                        ...prev,
                        agentStatus: data.all_agents || {
                            ...prev.agentStatus,
                            [data.agent]: data.status
                        }
                    }));
            } else if (data.type === "token_stats") {
                // Handle token statistics updates
                setQuestionState((prev)=>({
                        ...prev,
                        tokenStats: data.stats || prev.tokenStats
                    }));
            } else if (data.type === "progress") {
                // Handle structured progress updates (including parallel generation stages)
                setQuestionState((prev)=>({
                        ...prev,
                        progress: {
                            stage: data.stage || prev.progress.stage,
                            progress: {
                                ...prev.progress.progress,
                                ...data.progress,
                                total: data.total ?? prev.progress.progress.total
                            },
                            subFocuses: data.focuses || data.sub_focuses || prev.progress.subFocuses,
                            activeQuestions: prev.progress.activeQuestions,
                            completedQuestions: data.completed ?? prev.progress.completedQuestions,
                            failedQuestions: data.failed ?? prev.progress.failedQuestions
                        }
                    }));
            } else if (data.type === "question_update") {
                // Handle individual question updates (custom mode)
                const statusLabel = data.status === "analyzing" ? "Analyzing relevance" : data.status === "generating" ? "Generating" : data.status === "done" ? "Completed" : data.status;
                addQuestionLog({
                    type: data.status === "done" ? "success" : "system",
                    content: `[${data.question_id}] ${statusLabel}${data.focus ? `: ${data.focus.slice(0, 50)}...` : ""}`
                });
            } else if (data.type === "question_error") {
                // Handle individual question errors in parallel mode
                addQuestionLog({
                    type: "error",
                    content: `[${data.question_id}] Error: ${data.error}${data.reason ? ` - ${data.reason}` : ""}`
                });
            } else if (data.type === "knowledge_saved") {
                // Handle knowledge saved event (custom mode)
                addQuestionLog({
                    type: "success",
                    content: `Background knowledge retrieved (${data.queries?.length || 0} queries)`
                });
            } else if (data.type === "plan_ready") {
                // Handle plan ready event (custom mode)
                const focuses = data.focuses || data.plan?.focuses || [];
                setQuestionState((prev)=>({
                        ...prev,
                        progress: {
                            ...prev.progress,
                            stage: "planning",
                            subFocuses: focuses,
                            progress: {
                                ...prev.progress.progress,
                                status: "plan_ready"
                            }
                        }
                    }));
                addQuestionLog({
                    type: "success",
                    content: `Question plan created with ${focuses.length} focuses`
                });
            } else if (data.type === "batch_summary") {
                // Handle batch summary from custom mode generation
                setQuestionState((prev)=>({
                        ...prev,
                        progress: {
                            ...prev.progress,
                            subFocuses: data.sub_focuses || data.plan?.focuses || prev.progress.subFocuses,
                            completedQuestions: data.completed || prev.results.length,
                            failedQuestions: data.failed || 0,
                            progress: {
                                ...prev.progress.progress,
                                current: data.completed || prev.results.length,
                                total: data.requested || prev.count
                            }
                        }
                    }));
                addQuestionLog({
                    type: "success",
                    content: `Generation complete: ${data.completed}/${data.requested} questions generated${data.failed > 0 ? `, ${data.failed} failed` : ""}`
                });
            } else if (data.type === "result") {
                const isExtended = data.extended || data.validation?.decision === "extended";
                const questionPreview = data.question?.question?.slice(0, 50) || "Unknown";
                addQuestionLog({
                    type: "success",
                    content: `Question ${data.question_id || (data.index !== undefined ? `#${data.index + 1}` : "")} generated: ${questionPreview}...`
                });
                setQuestionState((prev)=>({
                        ...prev,
                        results: [
                            ...prev.results,
                            {
                                question: data.question,
                                validation: data.validation,
                                rounds: data.rounds || 1,
                                extended: isExtended
                            }
                        ],
                        progress: {
                            ...prev.progress,
                            stage: "generating",
                            completedQuestions: prev.results.length + 1,
                            progress: {
                                ...prev.progress.progress,
                                current: prev.results.length + 1,
                                total: prev.count,
                                round: data.rounds || 1
                            },
                            extendedQuestions: (prev.progress.extendedQuestions || 0) + (isExtended ? 1 : 0)
                        }
                    }));
            } else if (data.type === "complete") {
                setQuestionState((prev)=>({
                        ...prev,
                        step: "result",
                        progress: {
                            ...prev.progress,
                            stage: "complete",
                            completedQuestions: prev.results.length
                        }
                    }));
                ws.close();
            } else if (data.type === "error") {
                addQuestionLog({
                    type: "error",
                    content: `Error: ${data.content || data.message || "Unknown error"}`
                });
                setQuestionState((prev)=>({
                        ...prev,
                        progress: {
                            stage: null,
                            progress: {}
                        }
                    }));
            }
        };
        ws.onerror = ()=>{
            addQuestionLog({
                type: "error",
                content: "WebSocket connection error"
            });
            setQuestionState((prev)=>({
                    ...prev,
                    step: "config",
                    progress: {
                        stage: null,
                        progress: {}
                    },
                    agentStatus: {
                        QuestionGenerationAgent: "pending",
                        ValidationWorkflow: "pending",
                        RetrievalTool: "pending"
                    }
                }));
        };
        ws.onclose = ()=>{
            // Clean up WebSocket reference on close
            if (questionWs.current === ws) {
                questionWs.current = null;
            }
        };
    };
    // Helper function to handle mimic WebSocket messages
    const handleMimicWsMessage = (data, ws)=>{
        const stageMap = {
            init: "uploading",
            upload: "uploading",
            parsing: "parsing",
            processing: "extracting"
        };
        switch(data.type){
            case "log":
                addQuestionLog(data);
                break;
            case "status":
                {
                    const mappedStage = stageMap[data.stage] || data.stage;
                    addQuestionLog({
                        type: "system",
                        content: data.content || data.message || `Stage: ${data.stage}`
                    });
                    if (mappedStage) {
                        setQuestionState((prev)=>({
                                ...prev,
                                progress: {
                                    ...prev.progress,
                                    stage: mappedStage
                                }
                            }));
                    }
                    break;
                }
            case "progress":
                {
                    const stage = data.stage || "generating";
                    if (data.message) {
                        addQuestionLog({
                            type: "system",
                            content: data.message
                        });
                    }
                    setQuestionState((prev)=>({
                            ...prev,
                            progress: {
                                ...prev.progress,
                                stage: stage,
                                progress: {
                                    ...prev.progress.progress,
                                    current: data.current ?? prev.progress.progress.current,
                                    total: data.total_questions ?? data.total ?? prev.progress.progress.total,
                                    status: data.status
                                }
                            }
                        }));
                    // Store reference questions info when extracting is complete
                    if (stage === "extracting" && data.status === "complete" && data.reference_questions) {
                        setQuestionState((prev)=>({
                                ...prev,
                                progress: {
                                    ...prev.progress,
                                    progress: {
                                        ...prev.progress.progress,
                                        total: data.total_questions || data.reference_questions.length
                                    }
                                }
                            }));
                    }
                    break;
                }
            case "question_update":
                {
                    const statusMessage = data.status === "generating" ? `Generating mimic question ${data.index}...` : data.status === "failed" ? `Question ${data.index} failed: ${data.error}` : `Question ${data.index}: ${data.status}`;
                    addQuestionLog({
                        type: data.status === "failed" ? "warning" : "system",
                        content: statusMessage
                    });
                    if (data.current !== undefined) {
                        setQuestionState((prev)=>({
                                ...prev,
                                progress: {
                                    ...prev.progress,
                                    progress: {
                                        ...prev.progress.progress,
                                        current: data.current
                                    }
                                }
                            }));
                    }
                    break;
                }
            case "result":
                {
                    const isExtended = data.extended || data.validation?.decision === "extended";
                    addQuestionLog({
                        type: "success",
                        content: `✅ Question ${data.index || (data.current ?? 0)} generated successfully`
                    });
                    setQuestionState((prev)=>({
                            ...prev,
                            results: [
                                ...prev.results,
                                {
                                    question: data.question,
                                    validation: data.validation,
                                    rounds: data.rounds || 1,
                                    reference_question: data.reference_question,
                                    extended: isExtended
                                }
                            ],
                            progress: {
                                ...prev.progress,
                                stage: "generating",
                                progress: {
                                    ...prev.progress.progress,
                                    current: data.current ?? prev.results.length + 1,
                                    total: data.total ?? prev.progress.progress.total ?? 1
                                },
                                extendedQuestions: (prev.progress.extendedQuestions || 0) + (isExtended ? 1 : 0)
                            }
                        }));
                    break;
                }
            case "summary":
                addQuestionLog({
                    type: "success",
                    content: `Generation complete: ${data.successful}/${data.total_reference} succeeded`
                });
                setQuestionState((prev)=>({
                        ...prev,
                        progress: {
                            ...prev.progress,
                            stage: "generating",
                            progress: {
                                current: data.successful,
                                total: data.total_reference
                            },
                            completedQuestions: data.successful,
                            failedQuestions: data.failed
                        }
                    }));
                break;
            case "complete":
                addQuestionLog({
                    type: "success",
                    content: "✅ Mimic generation completed!"
                });
                setQuestionState((prev)=>({
                        ...prev,
                        step: "result",
                        progress: {
                            ...prev.progress,
                            stage: "complete",
                            completedQuestions: prev.results.length
                        }
                    }));
                ws.close();
                break;
            case "error":
                addQuestionLog({
                    type: "error",
                    content: `Error: ${data.content || data.message || "Unknown error"}`
                });
                setQuestionState((prev)=>({
                        ...prev,
                        step: "config",
                        progress: {
                            stage: null,
                            progress: {}
                        }
                    }));
                break;
        }
    };
    const startMimicQuestionGen = async (file, paperPath, kb, maxQuestions)=>{
        if (questionWs.current) questionWs.current.close();
        // Validate input
        const hasFile = file !== null;
        const hasParsedPath = paperPath && paperPath.trim() !== "";
        if (!hasFile && !hasParsedPath) {
            addQuestionLog({
                type: "error",
                content: "Please upload a PDF file or provide a parsed exam directory"
            });
            return;
        }
        // Initialize state
        setQuestionState((prev)=>({
                ...prev,
                step: "generating",
                mode: "mimic",
                logs: [],
                results: [],
                selectedKb: kb,
                uploadedFile: file,
                paperPath: paperPath,
                progress: {
                    stage: hasFile ? "uploading" : "parsing",
                    progress: {
                        current: 0,
                        total: maxQuestions || 1
                    }
                },
                agentStatus: {
                    QuestionGenerationAgent: "pending",
                    ValidationWorkflow: "pending",
                    RetrievalTool: "pending"
                },
                tokenStats: {
                    model: "Unknown",
                    calls: 0,
                    tokens: 0,
                    input_tokens: 0,
                    output_tokens: 0,
                    cost: 0.0
                }
            }));
        // Create WebSocket connection
        const ws = new WebSocket((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wsUrl"])("/api/v1/question/mimic"));
        questionWs.current = ws;
        ws.onopen = async ()=>{
            if (hasFile && file) {
                addQuestionLog({
                    type: "system",
                    content: "Preparing to upload PDF file..."
                });
                const reader = new FileReader();
                reader.onload = ()=>{
                    const base64Data = reader.result.split(",")[1];
                    ws.send(JSON.stringify({
                        mode: "upload",
                        pdf_data: base64Data,
                        pdf_name: file.name,
                        kb_name: kb,
                        max_questions: maxQuestions
                    }));
                    addQuestionLog({
                        type: "system",
                        content: `Uploaded: ${file.name}, parsing...`
                    });
                };
                reader.readAsDataURL(file);
            } else {
                ws.send(JSON.stringify({
                    mode: "parsed",
                    paper_path: paperPath,
                    kb_name: kb,
                    max_questions: maxQuestions
                }));
                addQuestionLog({
                    type: "system",
                    content: "Initializing Mimic Generator..."
                });
            }
        };
        ws.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            handleMimicWsMessage(data, ws);
        };
        ws.onerror = ()=>{
            addQuestionLog({
                type: "error",
                content: "WebSocket connection error"
            });
            setQuestionState((prev)=>({
                    ...prev,
                    step: "config"
                }));
        };
    };
    const resetQuestionGen = ()=>{
        setQuestionState((prev)=>({
                ...prev,
                step: "config",
                results: [],
                logs: [],
                progress: {
                    stage: null,
                    progress: {},
                    subFocuses: [],
                    activeQuestions: [],
                    completedQuestions: 0,
                    failedQuestions: 0
                },
                agentStatus: {
                    QuestionGenerationAgent: "pending",
                    ValidationWorkflow: "pending",
                    RetrievalTool: "pending"
                },
                tokenStats: {
                    model: "Unknown",
                    calls: 0,
                    tokens: 0,
                    input_tokens: 0,
                    output_tokens: 0,
                    cost: 0.0
                },
                uploadedFile: null,
                paperPath: ""
            }));
    };
    const addQuestionLog = (log)=>{
        setQuestionState((prev)=>({
                ...prev,
                logs: [
                    ...prev.logs,
                    log
                ]
            }));
    };
    // --- Research Logic ---
    const [researchState, setResearchState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_RESEARCH_STATE);
    const researchWs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Debounced save for research state
    const saveResearchState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["debounce"])((state)=>{
        if (!isHydrated.current) return;
        const toSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistState"])(state, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXCLUDE_FIELDS"].RESEARCH);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveToStorage"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].RESEARCH_STATE, toSave);
    }, 500), []);
    // Auto-save research state on change (only after hydration)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isHydrated.current) {
            saveResearchState(researchState);
        }
    }, [
        researchState,
        saveResearchState
    ]);
    const startResearch = (topic, kb, planMode = "medium", enabledTools = [
        "RAG"
    ], skipRephrase = false)=>{
        if (researchWs.current) researchWs.current.close();
        setResearchState((prev)=>({
                ...prev,
                status: "running",
                logs: [],
                report: null,
                topic,
                selectedKb: kb,
                progress: {
                    stage: null,
                    status: "",
                    executionMode: undefined,
                    totalBlocks: undefined,
                    currentBlock: undefined,
                    currentSubTopic: undefined,
                    currentBlockId: undefined,
                    iterations: undefined,
                    maxIterations: undefined,
                    toolsUsed: undefined,
                    currentTool: undefined,
                    currentQuery: undefined,
                    currentRationale: undefined,
                    queriesUsed: undefined,
                    activeTasks: undefined,
                    activeCount: undefined,
                    completedCount: undefined,
                    keptBlocks: undefined,
                    sections: undefined,
                    wordCount: undefined,
                    citations: undefined
                }
            }));
        const ws = new WebSocket((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wsUrl"])("/api/v1/research/run"));
        researchWs.current = ws;
        ws.onopen = ()=>{
            ws.send(JSON.stringify({
                topic,
                kb_name: kb,
                plan_mode: planMode,
                enabled_tools: enabledTools,
                skip_rephrase: skipRephrase
            }));
            addResearchLog({
                type: "system",
                content: `Starting Research Pipeline (Plan: ${planMode}, Tools: ${enabledTools.join("+")}, Optimization: ${!skipRephrase ? "On" : "Off/Pre-done"})...`
            });
        };
        ws.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if (data.type === "log") {
                addResearchLog(data);
            } else if (data.type === "progress") {
                // Handle structured progress messages with enhanced fields
                setResearchState((prev)=>{
                    // Parse active tasks for parallel mode
                    const activeTasks = data.active_tasks?.map((t)=>({
                            block_id: t.block_id,
                            sub_topic: t.sub_topic,
                            status: t.status,
                            iteration: t.iteration || 0,
                            max_iterations: t.max_iterations,
                            current_tool: t.current_tool,
                            current_query: t.current_query,
                            tools_used: t.tools_used
                        })) ?? prev.progress.activeTasks;
                    // Parse queries used
                    const queriesUsed = data.queries_used?.map((q)=>({
                            query: q.query,
                            tool_type: q.tool_type,
                            rationale: q.rationale,
                            iteration: q.iteration
                        })) ?? prev.progress.queriesUsed;
                    return {
                        ...prev,
                        progress: {
                            stage: data.stage,
                            status: data.status,
                            // Execution mode
                            executionMode: data.execution_mode ?? prev.progress.executionMode,
                            // Planning details
                            totalBlocks: data.total_blocks ?? prev.progress.totalBlocks,
                            // Researching details
                            currentBlock: data.current_block ?? prev.progress.currentBlock,
                            currentSubTopic: data.sub_topic ?? prev.progress.currentSubTopic,
                            currentBlockId: data.block_id ?? prev.progress.currentBlockId,
                            iterations: data.iteration ?? data.iterations ?? prev.progress.iterations,
                            maxIterations: data.max_iterations ?? prev.progress.maxIterations,
                            toolsUsed: data.tools_used ?? prev.progress.toolsUsed,
                            // Current action details
                            currentTool: data.tool_type ?? prev.progress.currentTool,
                            currentQuery: data.query ?? prev.progress.currentQuery,
                            currentRationale: data.rationale ?? prev.progress.currentRationale,
                            queriesUsed: queriesUsed,
                            // Parallel mode specific
                            activeTasks: activeTasks,
                            activeCount: data.active_count ?? prev.progress.activeCount,
                            completedCount: data.completed_count ?? prev.progress.completedCount,
                            // Reporting details
                            keptBlocks: data.kept_blocks ?? prev.progress.keptBlocks,
                            sections: data.sections ?? prev.progress.sections,
                            wordCount: data.word_count ?? prev.progress.wordCount,
                            citations: data.citations ?? prev.progress.citations
                        }
                    };
                });
            } else if (data.type === "result") {
                setResearchState((prev)=>({
                        ...prev,
                        status: "completed",
                        report: data.report
                    }));
                ws.close();
            } else if (data.type === "error") {
                addResearchLog({
                    type: "error",
                    content: `Error: ${data.content || data.message || "Unknown error"}`
                });
                setResearchState((prev)=>({
                        ...prev,
                        status: "idle"
                    }));
            }
        };
        ws.onerror = ()=>{
            addResearchLog({
                type: "error",
                content: "WebSocket connection error"
            });
            setResearchState((prev)=>({
                    ...prev,
                    status: "idle",
                    progress: {
                        stage: null,
                        status: "",
                        executionMode: undefined,
                        activeTasks: undefined
                    }
                }));
        };
        ws.onclose = ()=>{
            // Clean up WebSocket reference on close
            if (researchWs.current === ws) {
                researchWs.current = null;
            }
        };
    };
    const addResearchLog = (log)=>{
        setResearchState((prev)=>({
                ...prev,
                logs: [
                    ...prev.logs,
                    log
                ]
            }));
    };
    // --- IdeaGen Logic ---
    const [ideaGenState, setIdeaGenState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_IDEAGEN_STATE);
    // Debounced save for ideagen state
    const saveIdeaGenState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["debounce"])((state)=>{
        if (!isHydrated.current) return;
        const toSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistState"])(state, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXCLUDE_FIELDS"].IDEAGEN);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveToStorage"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].IDEAGEN_STATE, toSave);
    }, 500), []);
    // Auto-save ideagen state on change (only after hydration)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isHydrated.current) {
            saveIdeaGenState(ideaGenState);
        }
    }, [
        ideaGenState,
        saveIdeaGenState
    ]);
    // --- Chat Logic ---
    const [chatState, setChatState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_CHAT_STATE);
    const chatWs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Use ref to always have the latest sessionId in WebSocket callbacks (avoid closure issues)
    const sessionIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Debounced save for chat state
    const saveChatState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$debounce$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["debounce"])((state)=>{
        if (!isHydrated.current) return;
        const toSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistState"])(state, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EXCLUDE_FIELDS"].CHAT);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveToStorage"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$persistence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STORAGE_KEYS"].CHAT_STATE, toSave);
    }, 500), []);
    // Auto-save chat state on change (only after hydration)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isHydrated.current) {
            saveChatState(chatState);
        }
    }, [
        chatState,
        saveChatState
    ]);
    // --- Restore persisted state after hydration ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // This runs only on client after hydration
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        // Load persisted states
        const persistedSolver = undefined;
        const persistedQuestion = undefined;
        const persistedResearch = undefined;
        const persistedIdeaGen = undefined;
        const persistedChat = undefined;
    }, []);
    const sendChatMessage = (message)=>{
        if (!message.trim() || chatState.isLoading) return;
        // Add user message
        setChatState((prev)=>({
                ...prev,
                isLoading: true,
                currentStage: "connecting",
                messages: [
                    ...prev.messages,
                    {
                        role: "user",
                        content: message
                    }
                ]
            }));
        // Close existing connection if any
        if (chatWs.current) {
            chatWs.current.close();
        }
        const ws = new WebSocket((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wsUrl"])("/api/v1/chat"));
        chatWs.current = ws;
        let assistantMessage = "";
        ws.onopen = ()=>{
            // Build history from current messages (excluding the one just added)
            const history = chatState.messages.map((msg)=>({
                    role: msg.role,
                    content: msg.content
                }));
            ws.send(JSON.stringify({
                message,
                // Use ref to get the latest sessionId (avoids closure capturing stale state)
                session_id: sessionIdRef.current,
                history,
                kb_name: chatState.selectedKb,
                enable_rag: chatState.enableRag,
                enable_web_search: chatState.enableWebSearch
            }));
        };
        ws.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if (data.type === "session") {
                // Store session ID from backend - update both ref and state
                sessionIdRef.current = data.session_id;
                setChatState((prev)=>({
                        ...prev,
                        sessionId: data.session_id
                    }));
            } else if (data.type === "status") {
                setChatState((prev)=>({
                        ...prev,
                        currentStage: data.stage || data.message
                    }));
            } else if (data.type === "stream") {
                assistantMessage += data.content;
                setChatState((prev)=>{
                    const messages = [
                        ...prev.messages
                    ];
                    const lastMessage = messages[messages.length - 1];
                    if (lastMessage?.role === "assistant" && lastMessage?.isStreaming) {
                        // Update existing streaming message
                        messages[messages.length - 1] = {
                            ...lastMessage,
                            content: assistantMessage
                        };
                    } else {
                        // Add new streaming message
                        messages.push({
                            role: "assistant",
                            content: assistantMessage,
                            isStreaming: true
                        });
                    }
                    return {
                        ...prev,
                        messages,
                        currentStage: "generating"
                    };
                });
            } else if (data.type === "sources") {
                setChatState((prev)=>{
                    const messages = [
                        ...prev.messages
                    ];
                    const lastMessage = messages[messages.length - 1];
                    if (lastMessage?.role === "assistant") {
                        messages[messages.length - 1] = {
                            ...lastMessage,
                            sources: {
                                rag: data.rag,
                                web: data.web
                            }
                        };
                    }
                    return {
                        ...prev,
                        messages
                    };
                });
            } else if (data.type === "result") {
                setChatState((prev)=>{
                    const messages = [
                        ...prev.messages
                    ];
                    const lastMessage = messages[messages.length - 1];
                    if (lastMessage?.role === "assistant") {
                        messages[messages.length - 1] = {
                            ...lastMessage,
                            content: data.content,
                            isStreaming: false
                        };
                    }
                    return {
                        ...prev,
                        messages,
                        isLoading: false,
                        currentStage: null
                    };
                });
                ws.close();
            } else if (data.type === "error") {
                setChatState((prev)=>({
                        ...prev,
                        isLoading: false,
                        currentStage: null,
                        messages: [
                            ...prev.messages,
                            {
                                role: "assistant",
                                content: `Error: ${data.message}`
                            }
                        ]
                    }));
                ws.close();
            }
        };
        ws.onerror = ()=>{
            setChatState((prev)=>({
                    ...prev,
                    isLoading: false,
                    currentStage: null,
                    messages: [
                        ...prev.messages,
                        {
                            role: "assistant",
                            content: "Connection error. Please try again."
                        }
                    ]
                }));
        };
        ws.onclose = ()=>{
            if (chatWs.current === ws) {
                chatWs.current = null;
            }
            setChatState((prev)=>({
                    ...prev,
                    isLoading: false,
                    currentStage: null
                }));
        };
    };
    const clearChatHistory = ()=>{
        // Clear both ref and state
        sessionIdRef.current = null;
        setChatState((prev)=>({
                ...prev,
                sessionId: null,
                messages: [],
                currentStage: null
            }));
    };
    const newChatSession = ()=>{
        // Close any existing WebSocket
        if (chatWs.current) {
            chatWs.current.close();
            chatWs.current = null;
        }
        // Reset to new session - clear both ref and state
        sessionIdRef.current = null;
        setChatState((prev)=>({
                ...prev,
                sessionId: null,
                messages: [],
                isLoading: false,
                currentStage: null
            }));
    };
    const loadChatSession = async (sessionId)=>{
        try {
            const response = await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiUrl"])(`/api/v1/chat/sessions/${sessionId}`));
            if (!response.ok) {
                throw new Error("Session not found");
            }
            const session = await response.json();
            // Convert session messages to HomeChatMessage format
            const messages = session.messages.map((msg)=>({
                    role: msg.role,
                    content: msg.content,
                    sources: msg.sources,
                    isStreaming: false
                }));
            // Restore session settings
            const settings = session.settings || {};
            // Update ref with loaded session ID for continued conversation
            sessionIdRef.current = session.session_id;
            setChatState((prev)=>({
                    ...prev,
                    sessionId: session.session_id,
                    messages,
                    selectedKb: settings.kb_name || prev.selectedKb,
                    enableRag: settings.enable_rag ?? prev.enableRag,
                    enableWebSearch: settings.enable_web_search ?? prev.enableWebSearch,
                    isLoading: false,
                    currentStage: null
                }));
        } catch (error) {
            console.error("Failed to load session:", error);
            throw error;
        }
    };
    // --- Clear All Persistence ---
    const clearAllPersistence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // Import clearAllStorage dynamically to avoid circular dependencies
        __turbopack_context__.A("[project]/lib/persistence.ts [app-ssr] (ecmascript, async loader)").then(({ clearAllStorage })=>{
            clearAllStorage();
        });
        // Reset all states to defaults
        setSolverState(DEFAULT_SOLVER_STATE);
        setQuestionState(DEFAULT_QUESTION_STATE);
        setResearchState(DEFAULT_RESEARCH_STATE);
        setIdeaGenState(DEFAULT_IDEAGEN_STATE);
        setChatState(DEFAULT_CHAT_STATE);
        sessionIdRef.current = null;
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GlobalContext.Provider, {
        value: {
            solverState,
            setSolverState,
            startSolver,
            stopSolver,
            newSolverSession,
            loadSolverSession,
            questionState,
            setQuestionState,
            startQuestionGen,
            startMimicQuestionGen,
            resetQuestionGen,
            researchState,
            setResearchState,
            startResearch,
            ideaGenState,
            setIdeaGenState,
            chatState,
            setChatState,
            sendChatMessage,
            clearChatHistory,
            loadChatSession,
            newChatSession,
            uiSettings,
            refreshSettings,
            updateTheme,
            updateLanguage,
            sidebarWidth,
            setSidebarWidth,
            sidebarCollapsed,
            setSidebarCollapsed,
            toggleSidebar,
            sidebarDescription,
            setSidebarDescription,
            sidebarNavOrder,
            setSidebarNavOrder,
            clearAllPersistence
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/GlobalContext.tsx",
        lineNumber: 2129,
        columnNumber: 5
    }, this);
}
const useGlobal = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(GlobalContext);
    if (!context) throw new Error("useGlobal must be used within GlobalProvider");
    return context;
};
}),
"[project]/components/Sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-ssr] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$tool$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PenTool$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-tool.js [app-ssr] (ecmascript) <export default as PenTool>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calculator.js [app-ssr] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$microscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Microscope$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/microscope.js [app-ssr] (ecmascript) <export default as Microscope>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-ssr] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Book$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book.js [app-ssr] (ecmascript) <export default as Book>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.js [app-ssr] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$github$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Github$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/github.js [app-ssr] (ecmascript) <export default as Github>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-left.js [app-ssr] (ecmascript) <export default as ChevronsLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-right.js [app-ssr] (ecmascript) <export default as ChevronsRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-ssr] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$GlobalContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/GlobalContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const SIDEBAR_EXPANDED_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 64;
// All available navigation items (static reference)
const ALL_NAV_ITEMS = {
    "/": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
        nameKey: "Home"
    },
    "/history": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"],
        nameKey: "History"
    },
    "/knowledge": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        nameKey: "Knowledge Bases"
    },
    "/notebook": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Book$3e$__["Book"],
        nameKey: "Notebooks"
    },
    "/question": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$tool$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PenTool$3e$__["PenTool"],
        nameKey: "Question Generator"
    },
    "/solver": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"],
        nameKey: "Smart Solver"
    },
    "/guide": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"],
        nameKey: "Guided Learning"
    },
    "/ideagen": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
        nameKey: "IdeaGen"
    },
    "/research": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$microscope$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Microscope$3e$__["Microscope"],
        nameKey: "Deep Research"
    },
    "/co_writer": {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"],
        nameKey: "Co-Writer"
    }
};
function Sidebar() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { sidebarCollapsed, toggleSidebar, sidebarDescription, setSidebarDescription, sidebarNavOrder, setSidebarNavOrder } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$GlobalContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGlobal"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [showTooltip, setShowTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Editable description state
    const [isEditingDescription, setIsEditingDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingDescriptionValue, setEditingDescriptionValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(sidebarDescription);
    const descriptionInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Drag and drop state
    const [draggedItem, setDraggedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragOverItem, setDragOverItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragGroup, setDragGroup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Build navigation items from saved order - defined inside useMemo to properly capture dependencies
    const navGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const buildNavItems = (hrefs)=>{
            return hrefs.filter((href)=>ALL_NAV_ITEMS[href]).map((href)=>({
                    name: t(ALL_NAV_ITEMS[href].nameKey),
                    href,
                    icon: ALL_NAV_ITEMS[href].icon
                }));
        };
        return [
            {
                id: "start",
                name: t("Workspace"),
                items: buildNavItems(sidebarNavOrder.start)
            },
            {
                id: "learnResearch",
                name: t("Learn & Research"),
                items: buildNavItems(sidebarNavOrder.learnResearch)
            }
        ];
    }, [
        sidebarNavOrder,
        t
    ]);
    // Handle description edit
    const handleDescriptionEdit = ()=>{
        setEditingDescriptionValue(sidebarDescription);
        setIsEditingDescription(true);
    };
    const handleDescriptionSave = ()=>{
        setSidebarDescription(editingDescriptionValue.trim() || t("✨ Your description here"));
        setIsEditingDescription(false);
    };
    const handleDescriptionCancel = ()=>{
        setEditingDescriptionValue(sidebarDescription);
        setIsEditingDescription(false);
    };
    const handleDescriptionKeyDown = (e)=>{
        if (e.key === "Enter") {
            handleDescriptionSave();
        } else if (e.key === "Escape") {
            handleDescriptionCancel();
        }
    };
    // Focus input when editing starts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isEditingDescription && descriptionInputRef.current) {
            descriptionInputRef.current.focus();
            descriptionInputRef.current.select();
        }
    }, [
        isEditingDescription
    ]);
    // Drag and drop handlers
    const handleDragStart = (e, href, groupId)=>{
        setDraggedItem(href);
        setDragGroup(groupId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", href);
    };
    const handleDragOver = (e, href, groupId)=>{
        e.preventDefault();
        if (dragGroup !== groupId) return; // Only allow drag within same group
        if (draggedItem !== href) {
            setDragOverItem(href);
        }
    };
    const handleDragLeave = ()=>{
        setDragOverItem(null);
    };
    const handleDrop = (e, targetHref, groupId)=>{
        e.preventDefault();
        if (!draggedItem || dragGroup !== groupId) return;
        const groupKey = groupId;
        const currentOrder = [
            ...sidebarNavOrder[groupKey]
        ];
        const draggedIndex = currentOrder.indexOf(draggedItem);
        const targetIndex = currentOrder.indexOf(targetHref);
        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
            // Remove dragged item and insert at new position
            currentOrder.splice(draggedIndex, 1);
            currentOrder.splice(targetIndex, 0, draggedItem);
            setSidebarNavOrder({
                ...sidebarNavOrder,
                [groupKey]: currentOrder
            });
        }
        setDraggedItem(null);
        setDragOverItem(null);
        setDragGroup(null);
    };
    const handleDragEnd = ()=>{
        setDraggedItem(null);
        setDragOverItem(null);
        setDragGroup(null);
    };
    const currentWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex-shrink-0 bg-slate-50/80 dark:bg-slate-800/80 h-full border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
        style: {
            width: currentWidth
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `border-b border-slate-100 dark:border-slate-700 transition-all duration-300 ${sidebarCollapsed ? "px-2 py-3" : "px-4 py-3"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/logo.png",
                                                alt: t("DeepTutor Logo"),
                                                width: 32,
                                                height: 32,
                                                className: "object-contain",
                                                priority: true
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 230,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 229,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: `font-bold text-slate-900 dark:text-slate-100 tracking-tight text-base whitespace-nowrap transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`,
                                            children: "DeepTutor"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 239,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 228,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `flex items-center gap-0.5 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: toggleSidebar,
                                            className: "text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors",
                                            title: t("Collapse sidebar"),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__["ChevronsLeft"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 262,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 257,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://hkuds.github.io/DeepTutor/",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors",
                                            title: t("Visit DeepTutor Homepage"),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 271,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 264,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://github.com/HKUDS/DeepTutor",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors",
                                            title: t("View on GitHub"),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$github$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Github$3e$__["Github"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 280,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`,
                            children: isEditingDescription ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: descriptionInputRef,
                                        type: "text",
                                        value: editingDescriptionValue,
                                        onChange: (e)=>setEditingDescriptionValue(e.target.value),
                                        onKeyDown: handleDescriptionKeyDown,
                                        className: "flex-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-600 px-2 py-1.5 rounded-md border border-blue-300 dark:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                                        placeholder: t("Enter your description...")
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 293,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleDescriptionSave,
                                        className: "p-1 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300",
                                        title: t("Save"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 307,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 302,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleDescriptionCancel,
                                        className: "p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                                        title: t("Cancel"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-3.5 h-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 314,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 309,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 292,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: handleDescriptionEdit,
                                className: "text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 px-2 py-1.5 rounded-md border border-slate-100 dark:border-slate-600 truncate cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-500 transition-colors group",
                                title: t("Click to edit"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "group-hover:hidden",
                                        children: sidebarDescription
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 323,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden group-hover:inline text-blue-500 dark:text-blue-400",
                                        children: [
                                            "✏️ ",
                                            t("Click to edit")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 324,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 318,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 286,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Sidebar.tsx",
                    lineNumber: 224,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: `flex-1 overflow-y-auto py-2 space-y-4 transition-all duration-300 ${sidebarCollapsed ? "px-2" : "px-2"}`,
                children: navGroups.map((group, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 truncate transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 overflow-hidden px-0" : "opacity-100 px-1"}`,
                                children: group.name
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 342,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: group.items.map((item)=>{
                                    const isActive = pathname === item.href;
                                    const isDragging = draggedItem === item.href;
                                    const isDragOver = dragOverItem === item.href && dragGroup === group.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        draggable: !sidebarCollapsed,
                                        onDragStart: (e)=>!sidebarCollapsed && handleDragStart(e, item.href, group.id),
                                        onDragOver: (e)=>!sidebarCollapsed && handleDragOver(e, item.href, group.id),
                                        onDragLeave: handleDragLeave,
                                        onDrop: (e)=>!sidebarCollapsed && handleDrop(e, item.href, group.id),
                                        onDragEnd: handleDragEnd,
                                        className: `group relative ${isDragging ? "opacity-50" : ""} ${isDragOver ? "border-t-2 border-blue-500" : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: item.href,
                                                className: `flex items-center rounded-md border transition-all duration-200 ${sidebarCollapsed ? "justify-center p-2" : "gap-2.5 pl-2 pr-1.5 py-2"} ${isActive ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border-slate-100 dark:border-slate-600" : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm border-transparent hover:border-slate-100 dark:hover:border-slate-600"}`,
                                                onMouseEnter: ()=>sidebarCollapsed && setShowTooltip(item.href),
                                                onMouseLeave: ()=>setShowTooltip(null),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                        className: `w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400"}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Sidebar.tsx",
                                                        lineNumber: 395,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `font-medium text-sm whitespace-nowrap flex-1 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`,
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Sidebar.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-0 opacity-0 overflow-hidden" : "opacity-0 group-hover:opacity-100"}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                                                            className: "w-3.5 h-3.5 text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Sidebar.tsx",
                                                            lineNumber: 419,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Sidebar.tsx",
                                                        lineNumber: 412,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 379,
                                                columnNumber: 21
                                            }, this),
                                            sidebarCollapsed && showTooltip === item.href && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none",
                                                children: [
                                                    item.name,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Sidebar.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 424,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, item.href, true, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 359,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 351,
                                columnNumber: 13
                            }, this),
                            sidebarCollapsed && idx < navGroups.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-px bg-slate-200 dark:bg-slate-700 my-2 mx-1"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 435,
                                columnNumber: 15
                            }, this)
                        ]
                    }, group.id, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 340,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 transition-all duration-300 ${sidebarCollapsed ? "px-2 py-2" : "px-2 py-2"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/settings",
                                className: `flex items-center rounded-md text-sm transition-all duration-200 ${sidebarCollapsed ? "justify-center p-2" : "gap-2.5 pl-2 pr-1.5 py-2"} ${pathname === "/settings" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-600" : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"}`,
                                onMouseEnter: ()=>sidebarCollapsed && setShowTooltip("/settings"),
                                onMouseLeave: ()=>setShowTooltip(null),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                        className: `w-5 h-5 flex-shrink-0 transition-colors ${pathname === "/settings" ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 462,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `whitespace-nowrap flex-1 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`,
                                        children: t("Settings")
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 469,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 448,
                                columnNumber: 11
                            }, this),
                            sidebarCollapsed && showTooltip === "/settings" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none",
                                children: [
                                    t("Settings"),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-700"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 483,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 481,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 447,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleSidebar,
                        className: `w-full mt-2 flex items-center rounded-md text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-500 dark:hover:text-blue-400 hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-600 transition-all duration-200 ${sidebarCollapsed ? "justify-center p-2" : "gap-2.5 pl-2 pr-1.5 py-2"}`,
                        title: sidebarCollapsed ? t("Expand sidebar") : t("Collapse sidebar"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-5 h-5 flex items-center justify-center flex-shrink-0",
                                children: sidebarCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__["ChevronsRight"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 498,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsLeft$3e$__["ChevronsLeft"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 500,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 496,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-sm whitespace-nowrap flex-1 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`,
                                children: t("Collapse sidebar")
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 503,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 489,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 442,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Sidebar.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ThemeScript.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemeScript
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function ThemeScript() {
    const themeScript = `
    (function() {
      try {
        const stored = localStorage.getItem('deeptutor-theme');

        if (stored === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (stored === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // Use system preference if not set
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('deeptutor-theme', 'dark');
          } else {
            localStorage.setItem('deeptutor-theme', 'light');
          }
        }
      } catch (e) {
        // Silently fail - localStorage may be disabled
      }
    })();
  `;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
        dangerouslySetInnerHTML: {
            __html: themeScript
        },
        suppressHydrationWarning: true
    }, void 0, false, {
        fileName: "[project]/components/ThemeScript.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/LayoutWrapper.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LayoutWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
"use client";
;
function LayoutWrapper({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/locales/en/app.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"language.english\":\"English\",\"language.chinese\":\"中文\",\"Start\":\"Start\",\"Learn\":\"Learn\",\"Research\":\"Research\",\"Dashboard\":\"Dashboard\",\"Question Generator\":\"Question Generator\",\"Custom\":\"Custom\",\"Mimic Exam\":\"Mimic Exam\",\"Generating\":\"Generating\",\"questions\":\"questions\",\"extended\":\"extended\",\"Custom Mode\":\"Custom Mode\",\"Mimic Exam Paper Mode\":\"Mimic Exam Paper Mode\",\"Generate questions based on knowledge base content\":\"Generate questions based on knowledge base content\",\"Generate similar questions based on an exam paper\":\"Generate similar questions based on an exam paper\",\"Knowledge Point / Topic\":\"Knowledge Point / Topic\",\"e.g. Gradient Descent Optimization\":\"e.g. Gradient Descent Optimization\",\"Count\":\"Count\",\"Generate Questions\":\"Generate Questions\",\"Questions\":\"Questions\",\"Type your answer here...\":\"Type your answer here...\",\"Correct Answer\":\"Correct Answer\",\"Explanation\":\"Explanation\",\"Relevance Analysis\":\"Relevance Analysis\",\"round\":\"round\",\"s\":\"s\",\"Submit Answer\":\"Submit Answer\",\"Submitted\":\"Submitted\",\"Generating questions...\":\"Generating questions...\",\"View progress in the Logs panel\":\"View progress in the Logs panel\",\"Select a question to view details\":\"Select a question to view details\",\"Smart Solver\":\"Smart Solver\",\"IdeaGen\":\"IdeaGen\",\"Deep Research\":\"Deep Research\",\"Welcome to Deep Research Lab. \\n\\nPlease configure your settings above, then enter a research topic below.\":\"Welcome to Deep Research Lab. \\n\\nPlease configure your settings above, then enter a research topic below.\",\"PDF Export failed\":\"PDF Export failed\",\"Plan Mode\":\"Plan Mode\",\"Research Tools\":\"Research Tools\",\"Topic Optimization\":\"Topic Optimization\",\"Topic Assistant\":\"Topic Assistant\",\"Start Research\":\"Start Research\",\"Research in progress...\":\"Research in progress...\",\"Co-Writer\":\"Co-Writer\",\"Intelligent markdown editor with AI-powered writing assistance.\":\"Intelligent markdown editor with AI-powered writing assistance.\",\"Guided Learning\":\"Guided Learning\",\"Knowledge Bases\":\"Knowledge Bases\",\"Refresh knowledge bases\":\"Refresh knowledge bases\",\"New Knowledge Base\":\"New Knowledge Base\",\"Set as Default\":\"Set as Default\",\"Upload Documents\":\"Upload Documents\",\"Delete Knowledge Base\":\"Delete Knowledge Base\",\"Upload failed\":\"Upload failed\",\"No knowledge bases found. Create one to get started.\":\"No knowledge bases found. Create one to get started.\",\"Create Knowledge Base\":\"Create Knowledge Base\",\"Knowledge Base Name\":\"Knowledge Base Name\",\"Notebooks\":\"Notebooks\",\"Settings\":\"Settings\",\"Loading\":\"Loading...\",\"Save\":\"Save\",\"Cancel\":\"Cancel\",\"Error\":\"Error\",\"Success\":\"Success\",\"Unknown error\":\"Unknown error\",\"tokens\":\"tokens\",\"View All\":\"View All\",\"Refresh\":\"Refresh\",\"Create\":\"Create\",\"Overview\":\"Overview\",\"LLM\":\"LLM\",\"Embedding\":\"Embedding\",\"TTS\":\"TTS\",\"Search\":\"Search\",\"Light\":\"Light\",\"Dark\":\"Dark\",\"Configure your AI services and preferences\":\"Configure your AI services and preferences\",\"Local Data\":\"Local Data\",\"Clear Cache\":\"Clear Cache\",\"Confirm Clear\":\"Confirm Clear\",\"This will clear all locally cached data\":\"This will clear all locally cached data\",\"Clear All\":\"Clear All\",\"Including: chat history, solver history, question results, research reports, idea generation, guided learning progress, Co-Writer content, etc. This action cannot be undone.\":\"Including: chat history, solver history, question results, research reports, idea generation, guided learning progress, Co-Writer content, etc. This action cannot be undone.\",\"Model\":\"Model\",\"Provider\":\"Provider\",\"Port Configuration\":\"Port Configuration\",\"Backend Port\":\"Backend Port\",\"Frontend Port\":\"Frontend Port\",\"LLM Configuration\":\"LLM Configuration\",\"Configure language model providers\":\"Configure language model providers\",\"Embedding Configuration\":\"Embedding Configuration\",\"Configure embedding model providers\":\"Configure embedding model providers\",\"TTS Configuration\":\"TTS Configuration\",\"Configure text-to-speech providers\":\"Configure text-to-speech providers\",\"Search Configuration\":\"Search Configuration\",\"Configure web search providers\":\"Configure web search providers\",\"Add Configuration\":\"Add Configuration\",\"Default\":\"Default\",\"Active\":\"Active\",\"Set Active\":\"Set Active\",\"Test\":\"Test\",\"Edit\":\"Edit\",\"Delete\":\"Delete\",\"No configurations found. Add one to get started.\":\"No configurations found. Add one to get started.\",\"Are you sure you want to delete this configuration?\":\"Are you sure you want to delete this configuration?\",\"Connection test failed\":\"Connection test failed\",\"Name\":\"Name\",\"My Configuration\":\"My Configuration\",\"local\":\"local\",\"Base URL\":\"Base URL\",\"Use .env\":\"Use .env\",\"API Key\":\"API Key\",\"optional for local providers\":\"optional for local providers\",\"Not required\":\"Not required\",\"Base URL is required for testing\":\"Base URL is required for testing\",\"API Key is required for cloud providers\":\"API Key is required for cloud providers\",\"Model name is required\":\"Model name is required\",\"Dimensions is required for embedding models\":\"Dimensions is required for embedding models\",\"Connection successful\":\"Connection successful\",\"Connection failed\":\"Connection failed\",\"Connection test failed - network error\":\"Connection test failed - network error\",\"Failed to update configuration\":\"Failed to update configuration\",\"Failed to add configuration\":\"Failed to add configuration\",\"Edit Configuration\":\"Edit Configuration\",\"Add New Configuration\":\"Add New Configuration\",\"Test Connection\":\"Test Connection\",\"Save Changes\":\"Save Changes\",\"System Settings\":\"System Settings\",\"Manage system configuration and preferences\":\"Manage system configuration and preferences\",\"General Settings\":\"General Settings\",\"Environment Variables\":\"Environment Variables\",\"Interface Preferences\":\"Interface Preferences\",\"Theme\":\"Theme\",\"Light Mode\":\"Light Mode\",\"Dark Mode\":\"Dark Mode\",\"Language\":\"Language\",\"English\":\"English\",\"Chinese\":\"Chinese\",\"System Configuration\":\"System Configuration\",\"System Language\":\"System Language\",\"Default language for system operations\":\"Default language for system operations\",\"Web Search\":\"Web Search\",\"Max Results\":\"Max Results\",\"Knowledge Base\":\"Knowledge Base\",\"Default KB\":\"Default KB\",\"Base Directory\":\"Base Directory\",\"Text-to-Speech\":\"Text-to-Speech\",\"Default Voice\":\"Default Voice\",\"Default Language\":\"Default Language\",\"Active Models\":\"Active Models\",\"Status\":\"Status\",\"Active LLM Model\":\"Active LLM Model\",\"Not configured\":\"Not configured\",\"Configure in Environment Variables tab\":\"Configure in Environment Variables tab\",\"Save All Changes\":\"Save All Changes\",\"Configuration Saved\":\"Configuration Saved\",\"Configuration Status\":\"Configuration Status\",\"Refresh Status\":\"Refresh Status\",\"Runtime Configuration\":\"Runtime Configuration\",\"Environment variables are loaded from\":\"Environment variables are loaded from\",\"file on startup\":\"file on startup\",\"Changes made here take effect immediately but are not saved to file\":\"Changes made here take effect immediately but are not saved to file\",\"On restart, values will be reloaded from\":\"On restart, values will be reloaded from\",\"Apply Environment Changes\":\"Apply Environment Changes\",\"Environment Updated!\":\"Environment Updated!\",\"REQUIRED\":\"REQUIRED\",\"Error loading data\":\"Error loading data\",\"Failed to load settings\":\"Failed to load settings\",\"Failed to connect to backend\":\"Failed to connect to backend\",\"Overview of your recent learning activities\":\"Overview of your recent learning activities\",\"Recent Activity\":\"Recent Activity\",\"Loading activities...\":\"Loading activities...\",\"No recent activity found\":\"No recent activity found\",\"Start solving problems or generating questions!\":\"Start solving problems or generating questions!\",\"Problem Solved\":\"Problem Solved\",\"Question Generated\":\"Question Generated\",\"Research Report\":\"Research Report\",\"Activity\":\"Activity\",\"My Notebooks\":\"My Notebooks\",\"records\":\"records\",\"Solve\":\"Solve\",\"Question\":\"Question\",\"No notebooks yet\":\"No notebooks yet\",\"Create your first notebook\":\"Create your first notebook\",\"Create your first notebook above\":\"Create your first notebook above\",\"System Status\":\"System Status\",\"Quick Actions\":\"Quick Actions\",\"Ask a Question\":\"Ask a Question\",\"Generate Quiz\":\"Generate Quiz\",\"Home\":\"Home\",\"History\":\"History\",\"Welcome to DeepTutor\":\"Welcome to DeepTutor\",\"How can I help you today?\":\"How can I help you today?\",\"Ask anything...\":\"Ask anything...\",\"Type your message...\":\"Type your message...\",\"RAG\":\"RAG\",\"Select Knowledge Base\":\"Select Knowledge Base\",\"Explore Modules\":\"Explore Modules\",\"Smart Problem Solving\":\"Smart Problem Solving\",\"Generate Practice Questions\":\"Generate Practice Questions\",\"Deep Research Reports\":\"Deep Research Reports\",\"Generate Novel Ideas\":\"Generate Novel Ideas\",\"Searching knowledge base...\":\"Searching knowledge base...\",\"Searching the web...\":\"Searching the web...\",\"Generating response...\":\"Generating response...\",\"Clear Chat\":\"Clear Chat\",\"New Session\":\"New Session\",\"New\":\"New\",\"Ask a difficult question...\":\"Ask a difficult question...\",\"DeepTutor can make mistakes. Please verify important information.\":\"DeepTutor can make mistakes. Please verify important information.\",\"Logic Stream\":\"Logic Stream\",\"Running\":\"Running\",\"I can help you solve complex STEM problems using multi-step reasoning. Try asking about calculus, physics, or coding algorithms.\":\"I can help you solve complex STEM problems using multi-step reasoning. Try asking about calculus, physics, or coding algorithms.\",\"Sources\":\"Sources\",\"RAG Enabled\":\"RAG Enabled\",\"Web Search Enabled\":\"Web Search Enabled\",\"From Knowledge Base\":\"From Knowledge Base\",\"From Web\":\"From Web\",\"New Chat\":\"New Chat\",\"Save to Notebook\":\"Save to Notebook\",\"Click to edit\":\"Click to edit\",\"Expand sidebar\":\"Expand sidebar\",\"Collapse sidebar\":\"Collapse sidebar\",\"Collapse left panel\":\"Collapse left panel\",\"Search notebooks...\":\"Search notebooks...\",\"Loading records...\":\"Loading records...\",\"No records in this notebook\":\"No records in this notebook\",\"Chat Session\":\"Chat Session\",\"User\":\"User\",\"Assistant\":\"Assistant\",\"Multi-agent reasoning\":\"Multi-agent reasoning\",\"Auto-validated quizzes\":\"Auto-validated quizzes\",\"Comprehensive analysis\":\"Comprehensive analysis\",\"Brainstorm & synthesize\":\"Brainstorm & synthesize\",\"Step-by-step tutoring\":\"Step-by-step tutoring\",\"Collaborative writing\":\"Collaborative writing\",\"Collection of Research Ideas\":\"Collection of Research Ideas\",\"Research ideas containing {n} knowledge points\":\"Research ideas containing {n} knowledge points\",\"Select Source (Cross-Notebook)\":\"Select Source (Cross-Notebook)\",\"Clear\":\"Clear\",\"No notebooks with records found\":\"No notebooks with records found\",\"Your Thoughts\":\"Your Thoughts\",\"Optional\":\"Optional\",\"Required\":\"Required\",\"Describe your thoughts or research direction based on these materials...\":\"Describe your thoughts or research direction based on these materials...\",\"Describe your research topic or idea (no notebook selection needed)...\":\"Describe your research topic or idea (no notebook selection needed)...\",\"You can generate ideas from text description alone, or select notebook records above for richer context.\":\"You can generate ideas from text description alone, or select notebook records above for richer context.\",\"Generating...\":\"Generating...\",\"Discover research ideas from your notes\":\"Discover research ideas from your notes\",\"Select All\":\"Select All\",\"Save Selected\":\"Save Selected\",\"Generate Ideas ({n} items)\":\"Generate Ideas ({n} items)\",\"Generate Ideas (Text Only)\":\"Generate Ideas (Text Only)\",\"Chat History\":\"Chat History\",\"Solver History\":\"Solver History\",\"All Activities\":\"All Activities\",\"Filter by type\":\"Filter by type\",\"Today\":\"Today\",\"Yesterday\":\"Yesterday\",\"session\":\"session\",\"sessions\":\"sessions\",\"All\":\"All\",\"Chat\":\"Chat\",\"No history found\":\"No history found\",\"Your activities will appear here\":\"Your activities will appear here\",\"Continue\":\"Continue\",\"View\":\"View\",\"Close\":\"Close\",\"messages\":\"messages\",\"Failed to load session\":\"Failed to load session\",\"Add to Notebook\":\"Add to Notebook\",\"Added Successfully!\":\"Added Successfully!\",\"Record Preview\":\"Record Preview\",\"Select Notebooks\":\"Select Notebooks\",\"New Notebook\":\"New Notebook\",\"Notebook name\":\"Notebook name\",\"Color:\":\"Color:\",\"Create & Initialize\":\"Create & Initialize\",\"Loading notebooks...\":\"Loading notebooks...\",\"Record has been saved to {n} notebook\":\"Record has been saved to {n} notebook\",\"Record has been saved to {n} notebooks\":\"Record has been saved to {n} notebooks\",\"{n} notebook selected\":\"{n} notebook selected\",\"{n} notebooks selected\":\"{n} notebooks selected\",\"Select at least one notebook\":\"Select at least one notebook\",\"Saving...\":\"Saving...\",\"Import from Notebooks\":\"Import from Notebooks\",\"Select content from your notebooks to import\":\"Select content from your notebooks to import\",\"No notebooks found\":\"No notebooks found\",\"Select a notebook to view records\":\"Select a notebook to view records\",\"No records\":\"No records\",\"Selected {n} items\":\"Selected {n} items\",\"Import Selected\":\"Import Selected\",\"Backend Service\":\"Backend Service\",\"LLM Model\":\"LLM Model\",\"Embeddings\":\"Embeddings\",\"TTS Model\":\"TTS Model\",\"Checking...\":\"Checking...\",\"Online\":\"Online\",\"Offline\":\"Offline\",\"Configured\":\"Configured\",\"Not Configured\":\"Not Configured\",\"Unknown\":\"Unknown\",\"Testing...\":\"Testing...\",\"Test failed\":\"Test failed\",\"Link Folder\":\"Link Folder\",\"Link Local Folder\":\"Link Local Folder\",\"Folder Path\":\"Folder Path\",\"Paste or type the full folder path\":\"Paste or type the full folder path\",\"Supported files: PDF, DOCX, TXT, MD\":\"Supported files: PDF, DOCX, TXT, MD\",\"New and modified files will be automatically detected when you sync.\":\"New and modified files will be automatically detected when you sync.\",\"Folder linked successfully!\":\"Folder linked successfully!\",\"Failed to link folder\":\"Failed to link folder\",\"Activity Details\":\"Activity Details\",\"Type\":\"Type\",\"Final Answer\":\"Final Answer\",\"Parameters\":\"Parameters\",\"Generated Question\":\"Generated Question\",\"Correct Answer & Explanation\":\"Correct Answer & Explanation\",\"Answer:\":\"Answer:\",\"No explanation provided\":\"No explanation provided\",\"Topic:\":\"Topic:\",\"Difficulty:\":\"Difficulty:\",\"Type:\":\"Type:\",\"Topic\":\"Topic\",\"Report Preview\":\"Report Preview\",\"N/A\":\"N/A\",\"No question content\":\"No question content\",\"Workspace\":\"WORKSPACE\",\"Learn & Research\":\"Learn & Research\",\"✨ Your description here\":\"✨ Your description here\",\"Enter your description...\":\"Enter your description...\",\"Visit DeepTutor Homepage\":\"Visit DeepTutor Homepage\",\"View on GitHub\":\"View on GitHub\",\"KB\":\"KB\",\"Solution image\":\"Solution image\",\"Count:\":\"Count:\",\"Initializing\":\"Initializing\",\"Generating Search Queries\":\"Generating Search Queries\",\"Retrieving Knowledge\":\"Retrieving Knowledge\",\"Creating Question Plan\":\"Creating Question Plan\",\"Uploading PDF\":\"Uploading PDF\",\"Parsing PDF (MinerU)\":\"Parsing PDF (MinerU)\",\"Extracting Questions\":\"Extracting Questions\",\"Ready to Generate\":\"Ready to Generate\",\"Generation Complete\":\"Generation Complete\",\"Progress\":\"Progress\",\"Question Focuses ({n})\":\"Question Focuses ({n})\",\"Logs ({n})\":\"Logs ({n})\",\"Clear logs\":\"Clear logs\",\"Waiting for logs...\":\"Waiting for logs...\",\"Mimic Exam Mode\":\"Mimic Exam Mode\",\"Generating questions based on reference exam paper\":\"Generating questions based on reference exam paper\",\"Learning Assistant\":\"Learning Assistant\",\"Have any questions? Feel free to ask...\":\"Have any questions? Feel free to ask...\",\"Learning Summary\":\"Learning Summary\",\"Fix HTML Issue\":\"Fix HTML Issue\",\"Issue Description\":\"Issue Description\",\"Describe the HTML issue, e.g.: button not clickable, style display error, interaction not working...\":\"Describe the HTML issue, e.g.: button not clickable, style display error, interaction not working...\",\"Fixing...\":\"Fixing...\",\"Fix\":\"Fix\",\"Loading learning content...\":\"Loading learning content...\",\"Fix HTML\":\"Fix HTML\",\"Interactive Learning Content\":\"Interactive Learning Content\",\"Deselect\":\"Deselect\",\"Generate Learning Plan ({n} items)\":\"Generate Learning Plan ({n} items)\",\"Learning Progress\":\"Learning Progress\",\"Knowledge Point {n} / {total}\":\"Knowledge Point {n} / {total}\",\"Start Learning\":\"Start Learning\",\"Loading...\":\"Loading...\",\"Next\":\"Next\",\"Generating Summary...\":\"Generating Summary...\",\"Complete Learning\":\"Complete Learning\",\"Switch to narrow sidebar (1:3)\":\"Switch to narrow sidebar (1:3)\",\"Switch to wide sidebar (3:1)\":\"Switch to wide sidebar (3:1)\",\"Select a notebook, and the system will generate a personalized learning plan. Through interactive pages and intelligent Q&A, you'll gradually master all the content.\":\"Select a notebook, and the system will generate a personalized learning plan. Through interactive pages and intelligent Q&A, you'll gradually master all the content.\",\"Select notebook records or describe your research topic\":\"Select notebook records or describe your research topic\",\"Manage and explore your educational content repositories.\":\"Manage and explore your educational content repositories.\",\"RAG-Anything\":\"RAG-Anything\",\"RAG-Anything (Docling)\":\"RAG-Anything (Docling)\",\"Documents\":\"Documents\",\"Images\":\"Images\",\"Ready\":\"Ready\",\"Processing\":\"Processing\",\"Processing File\":\"Processing File\",\"Extracting Items\":\"Extracting Items\",\"Not Indexed\":\"Not Indexed\",\"e.g., Math101\":\"e.g., Math101\",\"Pure vector retrieval, fastest processing speed.\":\"Pure vector retrieval, fastest processing speed.\",\"Lightweight knowledge graph retrieval, fast processing of text documents.\":\"Lightweight knowledge graph retrieval, fast processing of text documents.\",\"Multimodal document processing with chart and formula extraction, builds knowledge graphs.\":\"Multimodal document processing with chart and formula extraction, builds knowledge graphs.\",\"Select a RAG pipeline suitable for your document type\":\"Select a RAG pipeline suitable for your document type\",\"Click or drop to add more files\":\"Click or drop to add more files\",\"Drag & drop files or folders here\":\"Drag & drop files or folders here\",\"{n} file selected\":\"{n} file selected\",\"{n} files selected\":\"{n} files selected\",\"Clear all\":\"Clear all\",\"Remove file\":\"Remove file\",\"Upload documents to\":\"Upload documents to\",\"RAG Provider\":\"RAG Provider\",\"RAG Provider (Optional)\":\"RAG Provider (Optional)\",\"Leave as-is to use the KB's existing provider\":\"Leave as-is to use the KB's existing provider\",\"Keep unchanged to use this KB's existing provider\":\"Keep unchanged to use this KB's existing provider\",\"Clear progress status\":\"Clear progress status\",\"DeepTutor Logo\":\"DeepTutor Logo\",\"Optimizing topic...\":\"Optimizing topic...\",\"Verified by DeepTutor Logic Engine\":\"Verified by DeepTutor Logic Engine\",\"Model:\":\"Model:\",\"Activity Log\":\"Activity Log\",\"Waiting for logic execution...\":\"Waiting for logic execution...\",\"gpt-4o\":\"gpt-4o\",\"Link a local folder to\":\"Link a local folder to\",\". Documents in the folder will be processed and added to this knowledge base.\":\". Documents in the folder will be processed and added to this knowledge base.\",\"C:\\\\Users\\\\name\\\\Documents\\\\papers\":\"C:\\\\Users\\\\name\\\\Documents\\\\papers\",\"📄 Supported files: PDF, DOCX, TXT, MD\":\"📄 Supported files: PDF, DOCX, TXT, MD\",\"💡 Tip:\":\"💡 Tip:\",\"Use folders synced with Google Drive, OneDrive, SharePoint, or Dropbox for automatic cloud integration.\":\"Use folders synced with Google Drive, OneDrive, SharePoint, or Dropbox for automatic cloud integration.\",\"Diagram rendering error\":\"Diagram rendering error\",\"Show source\":\"Show source\",\"Planning\":\"Planning\",\"Researching\":\"Researching\",\"Reporting\":\"Reporting\",\"Planning Research Strategy\":\"Planning Research Strategy\",\"Research Plan\":\"Research Plan\",\"Original Topic\":\"Original Topic\",\"Optimized Topic\":\"Optimized Topic\",\"No research data yet\":\"No research data yet\",\"(History)\":\"(History)\",\"Report Generated!\":\"Report Generated!\",\"Generating Report\":\"Generating Report\",\"Report Generation\":\"Report Generation\",\"Currently Writing\":\"Currently Writing\",\"Report Outline\":\"Report Outline\",\"View Full Report\":\"View Full Report\",\"Parallel Mode\":\"Parallel Mode\",\"AI Edit Assistant\":\"AI Edit Assistant\",\"Close dialog\":\"Close dialog\",\"Instruction (Optional)\":\"Instruction (Optional)\",\"e.g. Make it more formal...\":\"e.g. Make it more formal...\",\"Context Source (Optional)\":\"Context Source (Optional)\",\"Web\":\"Web\",\"Rewrite\":\"Rewrite\",\"Shorten\":\"Shorten\",\"Expand\":\"Expand\",\"AI Mark\":\"AI Mark\",\"Processing...\":\"Processing...\",\"Apply\":\"Apply\",\"Live Preview · Synced Scroll\":\"Live Preview · Synced Scroll\",\"Show AI Marks\":\"Show AI Marks\",\"Hide AI Marks\":\"Hide AI Marks\",\"Preview\":\"Preview\",\"Process\":\"Process\",\"Report\":\"Report\",\"Ready to Research\":\"Ready to Research\",\"Enter a topic in the left panel to start deep research.\":\"Enter a topic in the left panel to start deep research.\",\"Markdown\":\"Markdown\",\"Generating report preview...\":\"Generating report preview...\",\"Select a task to view execution details\":\"Select a task to view execution details\",\"Waiting for execution logs...\":\"Waiting for execution logs...\",\"No tasks initialized yet\":\"No tasks initialized yet\",\"Current Action:\":\"Current Action:\",\"Waiting to start...\":\"Waiting to start...\",\"Tools:\":\"Tools:\",\"User Query\":\"User Query\",\"Output\":\"Output\",\"Metadata\":\"Metadata\",\"No records yet\":\"No records yet\",\"Add records from Solver, Question, Research, or Co-Writer\":\"Add records from Solver, Question, Research, or Co-Writer\",\"Select a record to view details\":\"Select a record to view details\",\"Create New Notebook\":\"Create New Notebook\",\"Description (Optional)\":\"Description (Optional)\",\"Color\":\"Color\",\"Edit Notebook\":\"Edit Notebook\",\"Description\":\"Description\",\"Delete Notebook?\":\"Delete Notebook?\",\"Import Records\":\"Import Records\",\"Source Notebook\":\"Source Notebook\",\"Select a notebook...\":\"Select a notebook...\",\"Expand left panel\":\"Expand left panel\",\"Collapse middle panel\":\"Collapse middle panel\",\"Expand middle panel\":\"Expand middle panel\",\"Collapse right panel\":\"Collapse right panel\",\"Expand right panel\":\"Expand right panel\",\"Export as Markdown\":\"Export as Markdown\",\"Export as PDF\":\"Export as PDF\",\"Import records from other notebooks\":\"Import records from other notebooks\",\"My Notebook\":\"My Notebook\",\"Notes about machine learning...\":\"Notes about machine learning...\",\"This action cannot be undone. All records in this notebook will be permanently deleted.\":\"This action cannot be undone. All records in this notebook will be permanently deleted.\",\"Logs\":\"Logs\",\"Difficulty\":\"Difficulty\",\"Easy\":\"Easy\",\"Medium\":\"Medium\",\"Hard\":\"Hard\",\"Multiple Choice\":\"Multiple Choice\",\"Written\":\"Written\",\"Upload Exam Paper (PDF)\":\"Upload Exam Paper (PDF)\",\"Click to upload PDF\":\"Click to upload PDF\",\"The system will parse and generate questions\":\"The system will parse and generate questions\",\"OR\":\"OR\",\"Pre-parsed Directory\":\"Pre-parsed Directory\",\"KB Coverage\":\"KB Coverage\",\"Extension Points\":\"Extension Points\",\"KB Connection\":\"KB Connection\",\"Extended Aspects\":\"Extended Aspects\",\"Reasoning\":\"Reasoning\",\"e.g. 2211asm1\":\"e.g. 2211asm1\",\"Please upload a PDF exam paper\":\"Please upload a PDF exam paper\",\"Podcast Narration\":\"Podcast Narration\",\"Click to expand\":\"Click to expand\",\"Script only (TTS not configured)\":\"Script only (TTS not configured)\",\"Current note is empty, cannot generate narration.\":\"Current note is empty, cannot generate narration.\",\"Failed to generate narration, please try again.\":\"Failed to generate narration, please try again.\",\"Generating Podcast\":\"Generating Podcast\",\"Generate Podcast\":\"Generate Podcast\",\"Save Podcast to Notebook\":\"Save Podcast to Notebook\",\"After generation, the narration script will appear here.\":\"After generation, the narration script will appear here.\",\"Key Points\":\"Key Points\",\"After generation, 3-5 key points will be listed here.\":\"After generation, 3-5 key points will be listed here.\",\"Podcast Audio\":\"Podcast Audio\",\"Your browser does not support the audio element.\":\"Your browser does not support the audio element.\",\"TTS not configured, script generation only.\":\"TTS not configured, script generation only.\",\"After generation, you can play the podcast audio here.\":\"After generation, you can play the podcast audio here.\"}"));}),
"[project]/locales/zh/app.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("{\"language.english\":\"English\",\"language.chinese\":\"中文\",\"Start\":\"开始\",\"Learn\":\"学习\",\"Research\":\"研究\",\"Dashboard\":\"仪表盘\",\"Question Generator\":\"题目生成器\",\"Custom\":\"自定义\",\"Mimic Exam\":\"仿真试卷\",\"Generating\":\"生成中\",\"questions\":\"道题\",\"extended\":\"扩展\",\"Custom Mode\":\"自定义模式\",\"Mimic Exam Paper Mode\":\"仿真试卷模式\",\"Generate questions based on knowledge base content\":\"基于知识库内容生成题目\",\"Generate similar questions based on an exam paper\":\"基于试卷生成相似题目\",\"Knowledge Point / Topic\":\"知识点 / 主题\",\"e.g. Gradient Descent Optimization\":\"例如：梯度下降优化\",\"Count\":\"数量\",\"Generate Questions\":\"生成题目\",\"Questions\":\"题目列表\",\"Type your answer here...\":\"在此输入你的答案…\",\"Correct Answer\":\"正确答案\",\"Explanation\":\"解析\",\"Relevance Analysis\":\"相关性分析\",\"round\":\"轮\",\"s\":\"\",\"Submit Answer\":\"提交答案\",\"Submitted\":\"已提交\",\"Generating questions...\":\"正在生成题目…\",\"View progress in the Logs panel\":\"可在日志面板查看进度\",\"Select a question to view details\":\"请选择一道题查看详情\",\"Smart Solver\":\"智能解题\",\"IdeaGen\":\"创意生成\",\"Deep Research\":\"深度研究\",\"Welcome to Deep Research Lab. \\n\\nPlease configure your settings above, then enter a research topic below.\":\"欢迎来到深度研究实验室。\\n\\n请先在上方配置设置，然后在下方输入研究主题。\",\"PDF Export failed\":\"导出 PDF 失败\",\"Plan Mode\":\"计划模式\",\"Research Tools\":\"研究工具\",\"Topic Optimization\":\"主题优化\",\"Topic Assistant\":\"主题助手\",\"Start Research\":\"开始研究\",\"Research in progress...\":\"研究进行中…\",\"Co-Writer\":\"智能写作\",\"Intelligent markdown editor with AI-powered writing assistance.\":\"带 AI 写作辅助的智能 Markdown 编辑器。\",\"Guided Learning\":\"引导式学习\",\"Knowledge Bases\":\"知识库\",\"Refresh knowledge bases\":\"刷新知识库列表\",\"New Knowledge Base\":\"新建知识库\",\"Set as Default\":\"设为默认\",\"Upload Documents\":\"上传文档\",\"Delete Knowledge Base\":\"删除知识库\",\"Upload failed\":\"上传失败\",\"No knowledge bases found. Create one to get started.\":\"未找到任何知识库。请先创建一个。\",\"Create Knowledge Base\":\"创建知识库\",\"Knowledge Base Name\":\"知识库名称\",\"Notebooks\":\"笔记本\",\"Settings\":\"设置\",\"Loading\":\"加载中...\",\"Save\":\"保存\",\"Cancel\":\"取消\",\"Error\":\"错误\",\"Success\":\"成功\",\"Unknown error\":\"未知错误\",\"tokens\":\"tokens\",\"View All\":\"查看全部\",\"Refresh\":\"刷新\",\"Create\":\"创建\",\"Overview\":\"概览\",\"LLM\":\"LLM\",\"Embedding\":\"Embedding\",\"TTS\":\"TTS\",\"Search\":\"搜索\",\"Light\":\"浅色\",\"Dark\":\"深色\",\"Configure your AI services and preferences\":\"配置你的 AI 服务与偏好\",\"Local Data\":\"本地数据\",\"Clear Cache\":\"清除缓存\",\"Confirm Clear\":\"确认清除\",\"This will clear all locally cached data\":\"此操作将清除所有本地缓存数据\",\"Clear All\":\"全部清除\",\"Including: chat history, solver history, question results, research reports, idea generation, guided learning progress, Co-Writer content, etc. This action cannot be undone.\":\"包括：聊天记录、解题历史、题目生成结果、研究报告、创意生成、引导学习进度、Co-Writer 内容等。此操作不可撤销。\",\"Model\":\"模型\",\"Provider\":\"提供商\",\"Port Configuration\":\"端口配置\",\"Backend Port\":\"后端端口\",\"Frontend Port\":\"前端端口\",\"LLM Configuration\":\"LLM 配置\",\"Configure language model providers\":\"配置语言模型提供商\",\"Embedding Configuration\":\"Embedding 配置\",\"Configure embedding model providers\":\"配置向量模型提供商\",\"TTS Configuration\":\"TTS 配置\",\"Configure text-to-speech providers\":\"配置文字转语音提供商\",\"Search Configuration\":\"搜索配置\",\"Configure web search providers\":\"配置网络搜索提供商\",\"Add Configuration\":\"添加配置\",\"Default\":\"默认\",\"Active\":\"当前\",\"Set Active\":\"设为当前\",\"Test\":\"测试\",\"Edit\":\"编辑\",\"Delete\":\"删除\",\"No configurations found. Add one to get started.\":\"未找到任何配置。请先添加一个配置。\",\"Are you sure you want to delete this configuration?\":\"确定要删除此配置吗？\",\"Connection test failed\":\"连接测试失败\",\"Name\":\"名称\",\"My Configuration\":\"我的配置\",\"local\":\"本地\",\"Base URL\":\"Base URL\",\"Use .env\":\"使用 .env\",\"API Key\":\"API Key\",\"optional for local providers\":\"本地服务可选\",\"Not required\":\"不需要\",\"Base URL is required for testing\":\"测试需要 Base URL\",\"API Key is required for cloud providers\":\"云端服务需要 API Key\",\"Model name is required\":\"需要填写模型名称\",\"Dimensions is required for embedding models\":\"向量模型需要维度\",\"Connection successful\":\"连接成功\",\"Connection failed\":\"连接失败\",\"Connection test failed - network error\":\"连接测试失败：网络错误\",\"Failed to update configuration\":\"更新配置失败\",\"Failed to add configuration\":\"添加配置失败\",\"Edit Configuration\":\"编辑配置\",\"Add New Configuration\":\"添加新配置\",\"Test Connection\":\"测试连接\",\"Save Changes\":\"保存更改\",\"System Settings\":\"系统设置\",\"Manage system configuration and preferences\":\"管理系统配置和偏好设置\",\"General Settings\":\"常规设置\",\"Environment Variables\":\"环境变量\",\"Interface Preferences\":\"界面偏好\",\"Theme\":\"主题\",\"Light Mode\":\"浅色模式\",\"Dark Mode\":\"深色模式\",\"Language\":\"语言\",\"English\":\"英语\",\"Chinese\":\"中文\",\"System Configuration\":\"系统配置\",\"System Language\":\"系统语言\",\"Default language for system operations\":\"系统操作的默认语言\",\"Web Search\":\"网络搜索\",\"Max Results\":\"最大结果数\",\"Knowledge Base\":\"知识库\",\"Default KB\":\"默认知识库\",\"Base Directory\":\"基础目录\",\"Text-to-Speech\":\"文字转语音\",\"Default Voice\":\"默认语音\",\"Default Language\":\"默认语言\",\"Active Models\":\"活动模型\",\"Status\":\"状态\",\"Active LLM Model\":\"当前 LLM 模型\",\"Not configured\":\"未配置\",\"Configure in Environment Variables tab\":\"请在环境变量标签页中配置\",\"Save All Changes\":\"保存所有更改\",\"Configuration Saved\":\"配置已保存\",\"Configuration Status\":\"配置状态\",\"Refresh Status\":\"刷新状态\",\"Runtime Configuration\":\"运行时配置\",\"Environment variables are loaded from\":\"环境变量从\",\"file on startup\":\"文件加载于启动时\",\"Changes made here take effect immediately but are not saved to file\":\"此处的更改立即生效但不会保存到文件\",\"On restart, values will be reloaded from\":\"重启后，值将从以下文件重新加载\",\"Apply Environment Changes\":\"应用环境变量更改\",\"Environment Updated!\":\"环境变量已更新！\",\"REQUIRED\":\"必填\",\"Error loading data\":\"加载数据出错\",\"Failed to load settings\":\"加载设置失败\",\"Failed to connect to backend\":\"连接后端失败\",\"Overview of your recent learning activities\":\"您最近的学习活动概览\",\"Recent Activity\":\"最近活动\",\"Loading activities...\":\"加载活动中...\",\"No recent activity found\":\"未找到最近活动\",\"Start solving problems or generating questions!\":\"开始解题或生成题目吧！\",\"Problem Solved\":\"问题已解决\",\"Question Generated\":\"题目已生成\",\"Research Report\":\"研究报告\",\"Activity\":\"活动\",\"My Notebooks\":\"我的笔记本\",\"records\":\"条记录\",\"Solve\":\"解题\",\"Question\":\"题目\",\"No notebooks yet\":\"暂无笔记本\",\"Create your first notebook\":\"创建您的第一个笔记本\",\"Create your first notebook above\":\"请在上方创建你的第一个笔记本\",\"System Status\":\"系统状态\",\"Quick Actions\":\"快捷操作\",\"Ask a Question\":\"提问问题\",\"Generate Quiz\":\"生成测验\",\"Home\":\"首页\",\"History\":\"历史记录\",\"Welcome to DeepTutor\":\"欢迎使用 DeepTutor\",\"How can I help you today?\":\"今天我能帮您什么？\",\"Ask anything...\":\"问我任何问题...\",\"Type your message...\":\"输入您的消息...\",\"RAG\":\"知识库检索\",\"Select Knowledge Base\":\"选择知识库\",\"Explore Modules\":\"探索模块\",\"Smart Problem Solving\":\"智能问题解答\",\"Generate Practice Questions\":\"生成练习题\",\"Deep Research Reports\":\"深度研究报告\",\"Generate Novel Ideas\":\"生成创新想法\",\"Searching knowledge base...\":\"正在搜索知识库...\",\"Searching the web...\":\"正在搜索网络...\",\"Generating response...\":\"正在生成回复...\",\"Clear Chat\":\"清空对话\",\"New Session\":\"新会话\",\"New\":\"新建\",\"Ask a difficult question...\":\"输入一道难题…\",\"DeepTutor can make mistakes. Please verify important information.\":\"DeepTutor 可能会犯错，请核对重要信息。\",\"Logic Stream\":\"推理流\",\"Running\":\"运行中\",\"I can help you solve complex STEM problems using multi-step reasoning. Try asking about calculus, physics, or coding algorithms.\":\"我可以用多步推理帮助你解决复杂的 STEM 问题。你可以尝试提问微积分、物理或编程算法相关问题。\",\"Sources\":\"来源\",\"RAG Enabled\":\"已启用 RAG\",\"Web Search Enabled\":\"已启用网络搜索\",\"From Knowledge Base\":\"来自知识库\",\"From Web\":\"来自网络\",\"New Chat\":\"新对话\",\"Save to Notebook\":\"保存到笔记本\",\"Click to edit\":\"点击编辑\",\"Expand sidebar\":\"展开侧边栏\",\"Collapse sidebar\":\"收起侧边栏\",\"Collapse left panel\":\"收起左侧面板\",\"Search notebooks...\":\"搜索笔记本…\",\"Loading records...\":\"正在加载记录…\",\"No records in this notebook\":\"该笔记本暂无记录\",\"Chat Session\":\"聊天会话\",\"User\":\"用户\",\"Assistant\":\"助手\",\"Multi-agent reasoning\":\"多智能体推理\",\"Auto-validated quizzes\":\"自动校验的测验\",\"Comprehensive analysis\":\"全面分析\",\"Brainstorm & synthesize\":\"头脑风暴与综合\",\"Step-by-step tutoring\":\"循序渐进辅导\",\"Collaborative writing\":\"协作写作\",\"Collection of Research Ideas\":\"研究创意合集\",\"Research ideas containing {n} knowledge points\":\"包含 {n} 个知识点的研究创意\",\"Select Source (Cross-Notebook)\":\"选择来源（跨笔记本）\",\"Clear\":\"清空\",\"No notebooks with records found\":\"未找到包含记录的笔记本\",\"Your Thoughts\":\"你的想法\",\"Optional\":\"可选\",\"Required\":\"必填\",\"Describe your thoughts or research direction based on these materials...\":\"结合这些材料，描述你的想法或研究方向……\",\"Describe your research topic or idea (no notebook selection needed)...\":\"描述你的研究主题或想法（无需选择笔记本）……\",\"You can generate ideas from text description alone, or select notebook records above for richer context.\":\"你可以仅根据文字描述生成创意，或在上方选择笔记记录以获得更丰富的上下文。\",\"Generating...\":\"生成中…\",\"Discover research ideas from your notes\":\"从你的笔记中发现研究创意\",\"Select All\":\"全选\",\"Save Selected\":\"保存已选\",\"Generate Ideas ({n} items)\":\"生成创意（{n} 条）\",\"Generate Ideas (Text Only)\":\"生成创意（仅文字）\",\"Chat History\":\"聊天历史\",\"Solver History\":\"解题历史\",\"All Activities\":\"所有活动\",\"Filter by type\":\"按类型筛选\",\"Today\":\"今天\",\"Yesterday\":\"昨天\",\"session\":\"个会话\",\"sessions\":\"个会话\",\"All\":\"全部\",\"Chat\":\"聊天\",\"No history found\":\"未找到历史记录\",\"Your activities will appear here\":\"您的活动将显示在这里\",\"Continue\":\"继续\",\"View\":\"查看\",\"Close\":\"关闭\",\"messages\":\"条消息\",\"Failed to load session\":\"加载会话失败\",\"Add to Notebook\":\"保存到笔记本\",\"Added Successfully!\":\"保存成功！\",\"Record Preview\":\"记录预览\",\"Select Notebooks\":\"选择笔记本\",\"New Notebook\":\"新建笔记本\",\"Notebook name\":\"笔记本名称\",\"Color:\":\"颜色：\",\"Create & Initialize\":\"创建并初始化\",\"Loading notebooks...\":\"正在加载笔记本…\",\"Record has been saved to {n} notebook\":\"已保存到 {n} 个笔记本\",\"Record has been saved to {n} notebooks\":\"已保存到 {n} 个笔记本\",\"{n} notebook selected\":\"已选择 {n} 个笔记本\",\"{n} notebooks selected\":\"已选择 {n} 个笔记本\",\"Select at least one notebook\":\"请至少选择一个笔记本\",\"Saving...\":\"保存中…\",\"Import from Notebooks\":\"从笔记本导入\",\"Select content from your notebooks to import\":\"从你的笔记本中选择内容导入\",\"No notebooks found\":\"未找到笔记本\",\"Select a notebook to view records\":\"请选择一个笔记本查看记录\",\"No records\":\"暂无记录\",\"Selected {n} items\":\"已选择 {n} 项\",\"Import Selected\":\"导入已选\",\"Backend Service\":\"后端服务\",\"LLM Model\":\"LLM 模型\",\"Embeddings\":\"向量模型\",\"TTS Model\":\"TTS 模型\",\"Checking...\":\"检测中…\",\"Online\":\"在线\",\"Offline\":\"离线\",\"Configured\":\"已配置\",\"Not Configured\":\"未配置\",\"Unknown\":\"未知\",\"Testing...\":\"测试中…\",\"Test failed\":\"测试失败\",\"Link Folder\":\"关联文件夹\",\"Link Local Folder\":\"关联本地文件夹\",\"Folder Path\":\"文件夹路径\",\"Paste or type the full folder path\":\"粘贴或输入完整文件夹路径\",\"Supported files: PDF, DOCX, TXT, MD\":\"支持文件：PDF、DOCX、TXT、MD\",\"New and modified files will be automatically detected when you sync.\":\"同步时将自动检测新增与修改的文件。\",\"Folder linked successfully!\":\"文件夹关联成功！\",\"Failed to link folder\":\"关联文件夹失败\",\"Activity Details\":\"活动详情\",\"Type\":\"类型\",\"Final Answer\":\"最终答案\",\"Parameters\":\"参数\",\"Generated Question\":\"生成的题目\",\"Correct Answer & Explanation\":\"正确答案与解析\",\"Answer:\":\"答案：\",\"No explanation provided\":\"暂无解析\",\"Topic:\":\"主题：\",\"Difficulty:\":\"难度：\",\"Type:\":\"类型：\",\"Topic\":\"主题\",\"Report Preview\":\"报告预览\",\"N/A\":\"无\",\"No question content\":\"无题目内容\",\"Workspace\":\"工作区\",\"Learn & Research\":\"学习与研究\",\"✨ Your description here\":\"✨ 在此输入你的描述\",\"Enter your description...\":\"输入你的描述…\",\"Visit DeepTutor Homepage\":\"访问 DeepTutor 主页\",\"View on GitHub\":\"在 GitHub 查看\",\"KB\":\"知识库\",\"Solution image\":\"解题图片\",\"Count:\":\"数量：\",\"Initializing\":\"初始化中\",\"Generating Search Queries\":\"生成搜索查询\",\"Retrieving Knowledge\":\"检索知识\",\"Creating Question Plan\":\"生成题目计划\",\"Uploading PDF\":\"上传 PDF\",\"Parsing PDF (MinerU)\":\"解析 PDF（MinerU）\",\"Extracting Questions\":\"提取题目\",\"Ready to Generate\":\"准备生成\",\"Generation Complete\":\"生成完成\",\"Progress\":\"进度\",\"Question Focuses ({n})\":\"题目焦点（{n}）\",\"Logs ({n})\":\"日志（{n}）\",\"Clear logs\":\"清空日志\",\"Waiting for logs...\":\"等待日志…\",\"Mimic Exam Mode\":\"仿真试卷模式\",\"Generating questions based on reference exam paper\":\"正在基于参考试卷生成题目\",\"Learning Assistant\":\"学习助手\",\"Have any questions? Feel free to ask...\":\"有问题吗？欢迎随时提问…\",\"Learning Summary\":\"学习总结\",\"Fix HTML Issue\":\"修复 HTML 问题\",\"Issue Description\":\"问题描述\",\"Describe the HTML issue, e.g.: button not clickable, style display error, interaction not working...\":\"描述 HTML 问题，例如：按钮无法点击、样式显示错误、交互不生效…\",\"Fixing...\":\"修复中…\",\"Fix\":\"修复\",\"Loading learning content...\":\"正在加载学习内容…\",\"Fix HTML\":\"修复 HTML\",\"Interactive Learning Content\":\"交互式学习内容\",\"Deselect\":\"取消选择\",\"Generate Learning Plan ({n} items)\":\"生成学习计划（{n} 项）\",\"Learning Progress\":\"学习进度\",\"Knowledge Point {n} / {total}\":\"知识点 {n} / {total}\",\"Start Learning\":\"开始学习\",\"Loading...\":\"加载中…\",\"Next\":\"下一个\",\"Generating Summary...\":\"正在生成总结…\",\"Complete Learning\":\"完成学习\",\"Switch to narrow sidebar (1:3)\":\"切换为窄侧栏（1:3）\",\"Switch to wide sidebar (3:1)\":\"切换为宽侧栏（3:1）\",\"Select a notebook, and the system will generate a personalized learning plan. Through interactive pages and intelligent Q&A, you'll gradually master all the content.\":\"请选择一个笔记本，系统将生成个性化学习计划。通过交互页面与智能问答，你将逐步掌握全部内容。\",\"Select notebook records or describe your research topic\":\"选择笔记记录或直接描述你的研究主题\",\"Manage and explore your educational content repositories.\":\"管理与探索你的教育内容仓库。\",\"RAG-Anything\":\"RAG-Anything\",\"RAG-Anything (Docling)\":\"RAG-Anything (Docling)\",\"Documents\":\"文档\",\"Images\":\"图片\",\"Ready\":\"就绪\",\"Processing\":\"处理中\",\"Processing File\":\"处理文件\",\"Extracting Items\":\"提取内容\",\"Not Indexed\":\"未建立索引\",\"e.g., Math101\":\"例如：Math101\",\"Pure vector retrieval, fastest processing speed.\":\"纯向量检索，处理速度最快。\",\"Lightweight knowledge graph retrieval, fast processing of text documents.\":\"轻量级知识图谱检索，快速处理文本类文档。\",\"Multimodal document processing with chart and formula extraction, builds knowledge graphs.\":\"多模态文档处理（含图表/公式提取），并构建知识图谱。\",\"Select a RAG pipeline suitable for your document type\":\"请选择适合你文档类型的 RAG 流水线\",\"Click or drop to add more files\":\"点击或拖拽以继续添加文件\",\"Drag & drop files or folders here\":\"将文件或文件夹拖拽到此处\",\"{n} file selected\":\"已选择 {n} 个文件\",\"{n} files selected\":\"已选择 {n} 个文件\",\"Clear all\":\"清空全部\",\"Remove file\":\"移除文件\",\"Upload documents to\":\"上传文档到\",\"RAG Provider\":\"RAG 提供方\",\"RAG Provider (Optional)\":\"RAG 提供方（可选）\",\"Leave as-is to use the KB's existing provider\":\"保持不变以使用该知识库已有的提供方\",\"Keep unchanged to use this KB's existing provider\":\"保持不变以使用该知识库已有的提供方\",\"Clear progress status\":\"清除进度状态\",\"DeepTutor Logo\":\"DeepTutor Logo\",\"Optimizing topic...\":\"正在优化主题…\",\"Verified by DeepTutor Logic Engine\":\"由 DeepTutor 推理引擎校验\",\"Model:\":\"模型：\",\"Activity Log\":\"活动日志\",\"Waiting for logic execution...\":\"等待推理执行…\",\"gpt-4o\":\"gpt-4o\",\"Link a local folder to\":\"关联本地文件夹到\",\". Documents in the folder will be processed and added to this knowledge base.\":\"。文件夹内的文档将被处理并添加到该知识库。\",\"C:\\\\Users\\\\name\\\\Documents\\\\papers\":\"C:\\\\Users\\\\name\\\\Documents\\\\papers\",\"📄 Supported files: PDF, DOCX, TXT, MD\":\"📄 支持文件：PDF、DOCX、TXT、MD\",\"💡 Tip:\":\"💡 提示：\",\"Use folders synced with Google Drive, OneDrive, SharePoint, or Dropbox for automatic cloud integration.\":\"建议使用与 Google Drive、OneDrive、SharePoint 或 Dropbox 同步的文件夹以实现自动云端集成。\",\"Diagram rendering error\":\"图表渲染出错\",\"Show source\":\"显示源码\",\"Planning\":\"规划\",\"Researching\":\"研究中\",\"Reporting\":\"撰写报告\",\"Planning Research Strategy\":\"规划研究策略\",\"Research Plan\":\"研究计划\",\"Original Topic\":\"原始主题\",\"Optimized Topic\":\"优化后主题\",\"No research data yet\":\"暂无研究数据\",\"(History)\":\"（历史）\",\"Report Generated!\":\"报告已生成！\",\"Generating Report\":\"正在生成报告\",\"Report Generation\":\"报告生成\",\"Currently Writing\":\"正在撰写\",\"Report Outline\":\"报告大纲\",\"View Full Report\":\"查看完整报告\",\"Parallel Mode\":\"并行模式\",\"AI Edit Assistant\":\"AI 编辑助手\",\"Close dialog\":\"关闭对话框\",\"Instruction (Optional)\":\"指令（可选）\",\"e.g. Make it more formal...\":\"例如：使其更正式...\",\"Context Source (Optional)\":\"上下文来源（可选）\",\"Web\":\"网络\",\"Rewrite\":\"重写\",\"Shorten\":\"缩短\",\"Expand\":\"扩展\",\"AI Mark\":\"AI 批改\",\"Processing...\":\"处理中...\",\"Apply\":\"应用\",\"Live Preview · Synced Scroll\":\"实时预览 · 同步滚动\",\"Show AI Marks\":\"显示 AI 批注\",\"Hide AI Marks\":\"隐藏 AI 批注\",\"Preview\":\"预览\",\"Process\":\"过程\",\"Report\":\"报告\",\"Ready to Research\":\"准备开始研究\",\"Enter a topic in the left panel to start deep research.\":\"在左侧输入主题以开始深度研究。\",\"Markdown\":\"Markdown\",\"Generating report preview...\":\"正在生成报告预览…\",\"Select a task to view execution details\":\"选择一个任务以查看执行详情\",\"Waiting for execution logs...\":\"等待执行日志…\",\"No tasks initialized yet\":\"暂无任务\",\"Current Action:\":\"当前动作：\",\"Waiting to start...\":\"等待开始…\",\"Tools:\":\"工具：\",\"User Query\":\"用户问题\",\"Output\":\"输出\",\"Metadata\":\"元数据\",\"No records yet\":\"暂无记录\",\"Add records from Solver, Question, Research, or Co-Writer\":\"从解题、出题、研究或智能写作中添加记录\",\"Select a record to view details\":\"请选择一条记录查看详情\",\"Create New Notebook\":\"新建笔记本\",\"Description (Optional)\":\"描述（可选）\",\"Color\":\"颜色\",\"Edit Notebook\":\"编辑笔记本\",\"Description\":\"描述\",\"Delete Notebook?\":\"删除笔记本？\",\"Import Records\":\"导入记录\",\"Source Notebook\":\"来源笔记本\",\"Select a notebook...\":\"选择一个笔记本…\",\"Expand left panel\":\"展开左侧面板\",\"Collapse middle panel\":\"收起中间面板\",\"Expand middle panel\":\"展开中间面板\",\"Collapse right panel\":\"收起右侧面板\",\"Expand right panel\":\"展开右侧面板\",\"Export as Markdown\":\"导出为 Markdown\",\"Export as PDF\":\"导出为 PDF\",\"Import records from other notebooks\":\"从其他笔记本导入记录\",\"My Notebook\":\"我的笔记本\",\"Notes about machine learning...\":\"例如：关于机器学习的笔记…\",\"This action cannot be undone. All records in this notebook will be permanently deleted.\":\"此操作不可撤销。该笔记本内的所有记录将被永久删除。\",\"Logs\":\"日志\",\"Difficulty\":\"难度\",\"Easy\":\"简单\",\"Medium\":\"中等\",\"Hard\":\"困难\",\"Multiple Choice\":\"选择题\",\"Written\":\"主观题\",\"Upload Exam Paper (PDF)\":\"上传试卷（PDF）\",\"Click to upload PDF\":\"点击上传 PDF\",\"The system will parse and generate questions\":\"系统将解析并生成题目\",\"OR\":\"或\",\"Pre-parsed Directory\":\"预解析目录\",\"KB Coverage\":\"知识库覆盖率\",\"Extension Points\":\"扩展点\",\"KB Connection\":\"知识库连接\",\"Extended Aspects\":\"扩展维度\",\"Reasoning\":\"推理\",\"e.g. 2211asm1\":\"例如：2211asm1\",\"Please upload a PDF exam paper\":\"请上传 PDF 试卷\",\"Podcast Narration\":\"播客/旁白\",\"Click to expand\":\"点击展开\",\"Script only (TTS not configured)\":\"仅脚本（未配置 TTS）\",\"Current note is empty, cannot generate narration.\":\"当前笔记为空，无法生成旁白。\",\"Failed to generate narration, please try again.\":\"生成旁白失败，请重试。\",\"Generating Podcast\":\"正在生成播客\",\"Generate Podcast\":\"生成播客\",\"Save Podcast to Notebook\":\"保存播客到笔记本\",\"After generation, the narration script will appear here.\":\"生成后，旁白脚本将显示在这里。\",\"Key Points\":\"关键点\",\"After generation, 3-5 key points will be listed here.\":\"生成后，3-5 个关键点将列在这里。\",\"Podcast Audio\":\"播客音频\",\"Your browser does not support the audio element.\":\"您的浏览器不支持音频元素。\",\"TTS not configured, script generation only.\":\"TTS 未配置，仅生成脚本。\",\"After generation, you can play the podcast audio here.\":\"生成后，您可以在这里播放播客音频。\"}"));}),
"[project]/i18n/init.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initI18n",
    ()=>initI18n,
    "normalizeLanguage",
    ()=>normalizeLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/i18next/dist/esm/i18next.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/initReactI18next.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$locales$2f$en$2f$app$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/locales/en/app.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$locales$2f$zh$2f$app$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/locales/zh/app.json (json)");
;
;
;
;
function normalizeLanguage(lang) {
    if (!lang) return "en";
    const s = String(lang).toLowerCase();
    if (s === "zh" || s === "cn" || s === "chinese") return "zh";
    return "en";
}
let _initialized = false;
function initI18n(language) {
    if (_initialized) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
    const resources = {
        en: {
            app: __TURBOPACK__imported__module__$5b$project$5d2f$locales$2f$en$2f$app$2e$json__$28$json$29$__["default"]
        },
        zh: {
            app: __TURBOPACK__imported__module__$5b$project$5d2f$locales$2f$zh$2f$app$2e$json__$28$json$29$__["default"]
        }
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].use(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$initReactI18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initReactI18next"]).init({
        resources,
        lng: normalizeLanguage(language),
        fallbackLng: "en",
        // Use a single default namespace to keep lookups simple.
        // We intentionally keep keySeparator disabled so keys like "Generating..." remain valid.
        defaultNS: "app",
        ns: [
            "app"
        ],
        keySeparator: false,
        interpolation: {
            escapeValue: false
        },
        returnEmptyString: false,
        returnNull: false
    });
    _initialized = true;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
}
}),
"[project]/i18n/I18nProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "I18nProvider",
    ()=>I18nProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/i18next/dist/esm/i18next.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$init$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/i18n/init.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function I18nProvider({ language, children }) {
    // Ensure initialized on client once
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$init$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initI18n"])(language);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const nextLang = (0, __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$init$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeLanguage"])(language);
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].language !== nextLang) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$i18next$2f$dist$2f$esm$2f$i18next$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].changeLanguage(nextLang);
        }
        // Keep <html lang="..."> in sync for accessibility & Intl defaults
        if (typeof document !== "undefined") {
            document.documentElement.lang = nextLang;
        }
    }, [
        language
    ]);
    return children;
}
}),
"[project]/i18n/I18nClientBridge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "I18nClientBridge",
    ()=>I18nClientBridge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$GlobalContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/GlobalContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/i18n/I18nProvider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function I18nClientBridge({ children }) {
    const { uiSettings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$GlobalContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGlobal"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$i18n$2f$I18nProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["I18nProvider"], {
        language: uiSettings.language,
        children: children
    }, void 0, false, {
        fileName: "[project]/i18n/I18nClientBridge.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f6592f42._.js.map