import defaults from "@/consts/defaults";
import hasValue from "@/utils/has-value";
import mod from "@/utils/mod";

import { Cluster } from "puppeteer-cluster";

const CLUSTER_PARAMS = {
  concurrency: Cluster.CONCURRENCY_CONTEXT,
  maxConcurrency: 8,
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
  }

  setParameterData(parameterData) {
    this.parameterData = parameterData;
  }

  async initialize(configData) {
    this.configData = configData;

    this.cache = {};

    // Headless puppeteer cluster for rendering
    this.cluster = await Cluster.launch(CLUSTER_PARAMS);

    this.cluster.task(async ({ page, data }) => {
      page.setCacheEnabled(false);
      const { configData, parameterData, seed } = data;
      let { canvasSelector, thumbRes: resolution, url: baseUrl } = configData;
    
      resolution = isNaN(resolution) ? defaults.thumbRes : parseInt(resolution);

      page.setViewport({ width: resolution, height: resolution });

      const url = new URL(baseUrl);
      const urlParams = new URLSearchParams({ seed, resolution });

      url.search = urlParams.toString() + (hasValue(parameterData) ? `&parameters=${encodeURIComponent(JSON.stringify(parameterData))}` : "");

      let time = performance.now();
      await page.goto("about:blank");
      await page.goto(url.toString());
      console.log("Goto: ", performance.now() - time);

      time = performance.now();
      await page.waitForFunction(() => document.complete === true, {
        polling: 50,
        timeout: 0,
      });
      console.log("Wait for function: ", performance.now() - time);

      time = performance.now();
      const imageData = await page.evaluate((canvasSelector) => {
        let canvas = document.querySelector(canvasSelector ?? "canvas");
        return canvas.toDataURL();
      }, canvasSelector);      
      
      const imageBase64 = imageData.slice(imageData.indexOf(",") + 1);
      console.log("Image data: ", performance.now() - time);
      const parameters = await page.evaluate(() => window.parameters);

      await page.close();

      return { image: imageBase64, parameters, url: `${baseUrl}?seed=${seed}` };
    });
    this.isInitialized = true;
  }

  async executeRender({ seed }) {
    //const cacheElement = this.cache[seed];
    //if (cacheElement) return cacheElement;

    const { configData, parameterData } = this;
    const renderResult = await this.cluster.execute({ seed, configData, parameterData });
    //this.cache[seed] = renderResult;
    return renderResult;
  }

  async dispose() {
    if (!this.cluster) return;
    await this.cluster.close();
  }

}

const renderHandler = new RenderHandler();

export default renderHandler;
