import { test, expect } from "@playwright/test";

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
