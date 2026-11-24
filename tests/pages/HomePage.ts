import { type Locator, type Page } from "@playwright/test";
import { AboutSection } from "./AboutSection";
import { LanguageToggle } from "./components/LanguageToggle";
import { QualityFlow } from "./components/QualityFlow";

export class HomePage {
  readonly language: LanguageToggle;
  readonly flow: QualityFlow;
  readonly about: AboutSection;
  readonly hero: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.hero = page.getByRole("region", { name: "Joan De la Rosa" });
    this.language = new LanguageToggle(page);
    this.flow = new QualityFlow(page);
    this.about = new AboutSection(page);
  }

  async open(): Promise<void> {
    await this.page.addInitScript(() => {
      window.sessionStorage.setItem("portfolio-welcome-dismissed", "true");
    });
    await this.page.goto("/");
    await this.page.evaluate(() => document.fonts.ready);
  }

  get title(): Locator {
    return this.page.getByRole("heading", { level: 1, name: "Joan De la Rosa" });
  }

  get role(): Locator {
    return this.hero.locator(".role-line");
  }

  get introduction(): Locator {
    return this.hero.locator(".bio");
  }

  get aboutLink(): Locator {
    return this.page.getByRole("link", { name: "More about my work" });
  }

  async documentDimensions(): Promise<{ viewportWidth: number; documentWidth: number }> {
    return this.page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
  }

  async layoutBoxes(): Promise<Array<{ name: string; x: number; y: number; width: number; height: number }>> {
    const elements: Array<{ name: string; locator: Locator }> = [
      { name: "name", locator: this.title },
      { name: "role", locator: this.role },
      { name: "quality flow", locator: this.flow.root },
      { name: "introduction", locator: this.introduction },
      { name: "about link", locator: this.aboutLink },
    ];

    return Promise.all(elements.map(async ({ name, locator }) => {
      const box = await locator.boundingBox();
      if (!box) throw new Error(`Could not measure ${name}.`);
      return { name, ...box };
    }));
  }
}
