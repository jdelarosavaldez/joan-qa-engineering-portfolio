import { type Locator, type Page } from "@playwright/test";

export class AboutSection {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator("#about");
  }

  heading(name: string): Locator {
    return this.root.getByRole("heading", { level: 2, name });
  }

  get description(): Locator {
    return this.root.locator(".about-copy > p");
  }
}
