import hasValue from "@/utils/has-value";
import mod from "@/utils/mod";

const puppeter = require("puppeteer");

const PUPPETEER_CONFIG = {
  ignoreDefaultArgs: ["--disable-gpu"],
  args: ['--enable-webgl', "--use-gl=angle"],
  headless: true
};

class RenderHandler {
  constructor() {
    this.isInitialized = false;
  }

  setParameterData(parameterData) {
    this.parameterData = parameterData;
  }

  async initialize(configData) {
    this.configData = configData;

    const { numRenderInstances } = configData;
    // Cache for storing data from finished renders
    this.cache = {};
    // Headless puppeteer for rendering
    this.browsers = await Promise.all(Array(isNaN(numRenderInstances) ? 3 : parseInt(numRenderInstances)).fill().map(async _ => {
      const browser = await puppeter.launch(PUPPETEER_CONFIG);
      return await browser.createIncognitoBrowserContext();
    }));

    this.isInitialized = true;
  }

  async executeRender(data) {
    if (!this.isInitialized && process.env.NODE_ENV === "development") await this.initialize({ canvasSelector: "canvas", thumbRes: 450, url: "http://localhost:8080", numRenderInstances: 1 });

    const cacheElement = this.cache[data.seed];
    if (cacheElement) return cacheElement;

    let { canvasSelector, thumbRes: resolution, url: baseUrl } = this.configData;
    let { seed } = data;
    
    const nInst = this.browsers.length;
    const page = await this.browsers[mod(seed, nInst)].newPage();

    resolution = isNaN(resolution) ? 450 : parseInt(resolution);

    page.setViewport({ width: resolution, height: resolution });

    const url = new URL(baseUrl);
    const urlParams = new URLSearchParams({ seed, resolution });
    const parameterString = hasValue(this.parameterData) ? `&parameters=${encodeURIComponent(JSON.stringify(this.parameterData))}` : "";
    url.search = urlParams.toString() + parameterString;

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

    const renderResult = { image: imageBase64, parameters, url: `${baseUrl}?seed=${seed}` + parameterString };
    this.cache[data.seed] = renderResult;
    await page.close();
    return renderResult;
  }

  async dispose() {
    if (!this.browsers) return;
    return await Promise.allSettled(this.browsers.map(browser => browser.close()));
  }

}

const renderHandler = new RenderHandler();

export default renderHandler;