import { defaultConfig } from "@/consts/defaults";
import hasValue from "@/utils/has-value";
import mod from "@/utils/mod";

// Move all render logic into separate hooks
// Any render calls, whether bulk or continuous, triggers a procedure where the state is fetched regularly until finished

import { Cluster } from "puppeteer-cluster";

const CLUSTER_PARAMS = {
  concurrency: Cluster.CONCURRENCY_CONTEXT,
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
    this.renderStateBySeed = {};
    this.numFinishedRendering = 0;

    // Headless puppeteer cluster for rendering
    this.cluster = await Cluster.launch({ ...CLUSTER_PARAMS, maxConcurrency: configData.numRenderInstances });

    // TODO Error handling
    this.cluster.task(async ({ page, data }) => {
      page.setCacheEnabled(false);
      const { configData, parameterData, seed } = data;
      let { canvasSelector, thumbRes: resolution, url: baseUrl } = configData;
    
      resolution = parseInt(resolution);

      page.setViewport({ width: resolution, height: resolution });

      const url = new URL(baseUrl);
      const urlParams = new URLSearchParams({ seed, resolution });

      url.search = urlParams.toString() + (hasValue(parameterData) ? `&parameters=${encodeURIComponent(JSON.stringify(parameterData))}` : "");

      await page.goto(url.toString());
      await page.waitForFunction(() => document.complete === true, {
        polling: 50,
        timeout: 0,
      });

      const { width, height, image } = await page.evaluate((canvasSelector) => {
        const canvas = document.querySelector(canvasSelector);
        const { width, height } = canvas;
        return { width, height, image: canvas.toDataURL() };
      }, canvasSelector);      
      
      const imageBase64 = image.slice(image.indexOf(",") + 1);
      const parameters = await page.evaluate(() => window.parameters);

      await page.close();

      return { image: imageBase64, width, height, parameters, url: `${baseUrl}?seed=${seed}` };
    });
    this.isInitialized = true;
  }

  async executeRender({ seed }) {
    if (!this.isInitialized) await this.initialize(defaultConfig);
    if (this.cache[seed] || this.renderStateBySeed[seed]) return;

    this.renderStateBySeed[seed] = "queued";

    const { configData, parameterData } = this;
    const renderResult = await this.cluster.execute({ seed, configData, parameterData });
    this.cache[seed] = renderResult;
    this.renderStateBySeed[seed] = "finished";
    this.numFinishedRendering += 1;
  }

  getRenderData({ seed }) {
    return this.cache[seed];
  }

  getNumFinishedRendering() {
    return this.numFinishedRendering;
  }

  getRenderState() {
    return this.renderStateBySeed;
  }

  isIdle() {
    return !this.cluster || (this.cluster.jobQueue.size() === 0 && this.cluster.workersBusy.length === 0);
  }

  async dispose() {
    if (!this.cluster) return;
    await this.cluster.close();
  }

}

const renderHandler = new RenderHandler();

export default renderHandler;
