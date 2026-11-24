import { type Locator, type Page } from "@playwright/test";

export class QualityFlow {
  readonly root: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    // The accessible name changes with the selected language; the flow's fragment ID is its stable contract.
    this.root = page.locator("#flow");
  }

  station(name: string): Locator {
    return this.root.getByRole("button", { name });
  }

  async openStation(name: string): Promise<void> {
    await this.station(name).click();
  }

  async noteFor(name: string): Promise<Locator> {
    const station = this.station(name);
    const noteId = await station.getAttribute("aria-controls");
    if (!noteId) throw new Error(`Station "${name}" must expose aria-controls.`);
    return this.page.locator(`#${noteId}`);
  }

  async strategySpacing(): Promise<{ labelAlignment: number; shapeOffset: number; startCircleClearance: number }> {
    const startCircle = await this.root.locator(".flow-start").boundingBox();
    const strategy = this.station("Strategy");
    const stationBox = await strategy.boundingBox();
    const shapeBox = await strategy.locator(".station-shape").boundingBox();
    const labelBox = await strategy.locator(".station-label").boundingBox();
    if (!startCircle || !stationBox || !shapeBox || !labelBox) {
      throw new Error("Strategy and the flow start circle must have measurable dimensions.");
    }

    return {
      labelAlignment: Math.abs(labelBox.x - stationBox.x),
      shapeOffset: shapeBox.x - labelBox.x,
      startCircleClearance: shapeBox.x - (startCircle.x + startCircle.width),
    };
  }
}
