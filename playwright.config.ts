import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  // Locally the machine (macOS 13) cannot run Playwright's bundled Chromium, so the installed Chrome is used; CI uses Chromium.
  use: { baseURL: "http://127.0.0.1:4173", channel: process.env.CI ? undefined : "chrome" },
  webServer: { command: "npx serve out -l 4173 -n", url: "http://127.0.0.1:4173", reuseExistingServer: !process.env.CI, timeout: 60_000 },
  reporter: process.env.CI ? "github" : "list",
});
