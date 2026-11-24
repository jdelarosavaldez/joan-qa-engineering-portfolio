import { type Locator, type Page } from "@playwright/test";

export class LanguageToggle {
  private readonly group: Locator;

  constructor(page: Page) {
    // Its accessible label changes with the selected language; scope to the visible control instead.
    this.group = page.locator(".language-switch");
  }

  option(language: "en" | "es"): Locator {
    const accessibleName = language === "en" ? "EN — English" : "ES — Spanish";
    return this.group.getByRole("button", { name: accessibleName });
  }

  async select(language: "en" | "es"): Promise<void> {
    await this.option(language).click();
  }
}
