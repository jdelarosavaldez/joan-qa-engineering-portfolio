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

  async endpointSpacing(
    strategyName: string,
    qualityName: string,
  ): Promise<{ startGap: number; endGap: number; gapDifference: number; axisOffset: number; strategyCenterOffset: number }> {
    const startCircle = await this.root.locator(".flow-start").boundingBox();
    const finishCircle = await this.root.locator(".flow-finish").boundingBox();
    const line = await this.root.locator(".flow-line").boundingBox();
    const strategy = this.station(strategyName);
    const quality = this.station(qualityName);
    const strategyShape = await strategy.locator(".station-shape").boundingBox();
    const qualityShape = await quality.locator(".station-shape").boundingBox();
    const strategyLabel = await strategy.locator(".station-label").boundingBox();

    if (!startCircle || !finishCircle || !line || !strategyShape || !qualityShape || !strategyLabel) {
      throw new Error("The flow line, endpoints, and endpoint stations must have measurable dimensions.");
    }

    const centerY = (box: { y: number; height: number }) => box.y + box.height / 2;
    const lineCenterY = centerY(line);
    const startGap = strategyShape.x - (startCircle.x + startCircle.width);
    const endGap = finishCircle.x - (qualityShape.x + qualityShape.width);

    return {
      startGap,
      endGap,
      gapDifference: Math.abs(startGap - endGap),
      axisOffset: Math.max(
        Math.abs(centerY(startCircle) - lineCenterY),
        Math.abs(centerY(finishCircle) - lineCenterY),
        Math.abs(centerY(strategyShape) - lineCenterY),
        Math.abs(centerY(qualityShape) - lineCenterY),
      ),
      strategyCenterOffset: Math.abs(
        strategyShape.x + strategyShape.width / 2 - (strategyLabel.x + strategyLabel.width / 2),
      ),
    };
  }

  async stationLabelWidths(): Promise<Array<{ label: string; clientWidth: number; scrollWidth: number }>> {
    return this.root.locator(".station-label").evaluateAll((labels) => labels.map((label) => ({
      label: label.textContent ?? "",
      clientWidth: (label as HTMLElement).clientWidth,
      scrollWidth: (label as HTMLElement).scrollWidth,
    })));
  }
}
