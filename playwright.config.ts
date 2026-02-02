import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5179',
        trace: 'on-first-retry',
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 1,
    },
    snapshotPathTemplate: '{testDir}/{testFileDir}/screenshots/{arg}.png',
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
            },
        },
    ],
    webServer: {
        command: 'npm run dev -- --port 5179',
        url: 'http://localhost:5179',
        reuseExistingServer: !process.env.CI,
    },
    timeout: 60000,
    expect: {
        timeout: 5000,
        toHaveScreenshot: { maxDiffPixels: 0 }
    }
});
