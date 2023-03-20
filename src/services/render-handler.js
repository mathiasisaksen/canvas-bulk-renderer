const puppeter = require("puppeteer");

class RenderHandler {
  constructor() {
    this.isInitialized = false;
  }

  async initialize({ numBrowsers = 3 } = {}) {

    // Cache for storing data from finished renders
    this.cache = {};
    // Headless puppeteer for rendering
    this.browsers = await Promise.all(Array(isNaN(numBrowsers) ? 3 : parseInt(numBrowsers)).fill().map(async _ => 
      await puppeter.launch({
        ignoreDefaultArgs: ["--disable-gpu"],
        args: ['--enable-webgl', "--use-gl=angle"]
    })));

     
    this.isInitialized = true;
  }

  async executeRender(data) {
    if (!this.isInitialized && process.env.NODE_ENV === "development") await this.initialize({ numBrowsers: 1 });

    const cacheElement = this.cache[data.seed];
    if (cacheElement) return cacheElement;

    const page = await this.browsers[data.seed % this.browsers.length].newPage();
    let { seed, canvasSelector, resolution, baseUrl } = data;

    resolution = isNaN(resolution) ? 450 : parseInt(resolution);

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

    const renderResult = { image: imageBase64, parameters };
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