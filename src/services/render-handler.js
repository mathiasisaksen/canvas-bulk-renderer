import { Cluster } from "puppeteer-cluster";

const CLUSTER_PARAMS = {
  concurrency: Cluster.CONCURRENCY_BROWSER,
  maxConcurrency: 4,
  headless: true,
  monitor: true,
  timeout: 999999999,
  puppeteerOptions: {
    ignoreDefaultArgs: ["--disable-gpu"],
    args: ['--enable-webgl', "--use-gl=angle"]
  }
}

class RenderHandler {
  constructor() {
    this.isInitialized = false;
    console.log('this.isInitialized: ', this.isInitialized);
  }

  async initialize() {
    // Cache for storing data from finished renders
    this.cache = {};
    // Headless puppeteer cluster for rendering
    this.cluster = await Cluster.launch(CLUSTER_PARAMS);

    this.cluster.task(async ({ page, data }) => {
      const { seed, canvasSelector, resolution, baseUrl } = data;

      page.setViewport({ width: resolution, height: resolution });

      const url = new URL(baseUrl);
      const urlParams = new URLSearchParams({ seed, res: resolution });

      url.search = urlParams.toString();

      await page.goto(url.toString());

      await page.waitForFunction(() => document.complete === true, {
        polling: 50,
        timeout: 0,
      });

      const imageData = await page.evaluate((canvasSelector) => {
        let canvas = document.querySelector(canvasSelector ?? "canvas");
        return canvas.toDataURL();
      }, canvasSelector);      

      const imageBase64 = imageData.slice(imageData.indexOf(",") + 1);
      const parameters = await page.evaluate(() => window.parameters); 
      
      return { image: imageBase64, parameters };
    });

    this.isInitialized = true;
  }

  async executeRender(data) {
    if (!this.isInitialized) await this.initialize();

    const cacheElement = this.cache[data.seed];
    if (cacheElement) return cacheElement;
    
    const renderResult = await this.cluster.execute(data);
    this.cache[data.seed] = renderResult;
    return renderResult;
  }

}

export default RenderHandler;