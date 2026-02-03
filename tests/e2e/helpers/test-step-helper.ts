import { type Page, type TestInfo, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

export interface Verification {
  spec: string;
  check: () => Promise<void>;
}

export interface StepOptions {
  description: string;
  verifications: Verification[];
  networkStatus?: "synced" | "offline" | "error" | "skip";
}

interface DocStep {
  title: string;
  image: string;
  specs: string[];
}

export class TestStepHelper {
  private stepCount = 0;
  private steps: DocStep[] = [];

  constructor(
    private page: Page,
    private testInfo: TestInfo,
  ) {}

  setMetadata(title: string, description: string) {
    // Ideally store this for the doc header
  }

  async step(id: string, options: StepOptions) {
    // 1. Run Verification
    for (const v of options.verifications) {
      await v.check();
    }

    // 2. Generate Name
    const paddedIndex = String(this.stepCount++).padStart(3, "0");
    const filename = `${paddedIndex}-${id.replace(/_/g, "-")}.png`;

    // 3. Stabilization: Wait for Network Sync (if present)
    // (Skipping network sync checks for WordCandy MVP as elements don't exist yet)

    // 4. Capture & Verify (Zero-Pixel Tolerance)
    // This will check against the baseline in 'screenshots/{filename}'.
    // If the file doesn't exist, it will fail (unless --update-snapshots is used).
    await expect(this.page).toHaveScreenshot(filename.replace(/\.png$/, ""));

    // 5. Record for Docs
    this.steps.push({
      title: options.description,
      image: `./screenshots/${filename}`,
      specs: options.verifications.map((v) => v.spec),
    });
  }

  generateDocs() {
    // Ensure the directory exists
    const testDir = path.dirname(this.testInfo.file);

    const docPath = path.join(testDir, "README.md");
    let content = `# Test: ${this.testInfo.title}\n\n`;

    for (const step of this.steps) {
      content += `## ${step.title}\n\n`;
      content += `![${step.title}](${step.image})\n\n`;
      content += `**Verifications:**\n`;
      for (const spec of step.specs) {
        content += `- [x] ${spec}\n`;
      }
      content += `\n---\n\n`;
    }

    fs.writeFileSync(docPath, content);
  }
}
