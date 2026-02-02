import { type Page, type TestInfo, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface Verification {
    spec: string;
    check: () => Promise<void>;
}

interface StepOptions {
    description: string;
    verifications: Verification[];
}

export class TestStepHelper {
    private page: Page;
    private testInfo: TestInfo;
    private stepCount: number = 0;
    private title: string = '';
    private goal: string = '';
    private steps: { name: string; options: StepOptions }[] = [];

    constructor(page: Page, testInfo: TestInfo) {
        this.page = page;
        this.testInfo = testInfo;
    }

    setMetadata(title: string, goal: string) {
        this.title = title;
        this.goal = goal;
    }

    async step(name: string, options: StepOptions) {
        const stepNum = String(this.stepCount).padStart(3, '0');
        const filename = `${stepNum}-${name}.png`;

        // Write to source directory based on test file location
        const testDir = path.dirname(this.testInfo.file);
        const screenshotPath = path.join(testDir, 'screenshots', filename);

        // Ensure screenshots directory exists
        const dir = path.dirname(screenshotPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Capture screenshot
        await this.page.screenshot({ path: screenshotPath });

        // Run verifications
        for (const v of options.verifications) {
            await v.check();
        }

        this.steps.push({ name, options });
        this.stepCount++;
    }

    generateDocs() {
        if (!this.title) return;

        let md = `# ${this.title}\n\n`;
        md += `**Goal**: ${this.goal}\n\n`;

        md += `## Steps\n`;

        this.steps.forEach((step, index) => {
            const stepNum = String(index).padStart(3, '0');
            md += `### ${index + 1}. ${step.options.description}\n\n`;
            md += `![${step.name}](./screenshots/${stepNum}-${step.name}.png)\n\n`;
            md += `**Verifications**:\n`;
            step.options.verifications.forEach(v => {
                md += `- [x] ${v.spec}\n`;
            });
            md += `\n`;
        });

        const testDir = path.dirname(this.testInfo.file);
        const docPath = path.join(testDir, 'README.md');
        fs.writeFileSync(docPath, md);
    }
}
