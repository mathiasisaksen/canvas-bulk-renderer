import generateTxHash from "@/utils/generate-tx-hash";
import hasValue from "@/utils/has-value";

// Move all render logic into separate hooks
// Any render calls, whether bulk or continuous, triggers a procedure where the state is fetched regularly until finished

import { Cluster } from "puppeteer-cluster";

const CLUSTER_PARAMS = {
  concurrency: Cluster.CONCURRENCY_BROWSER,
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
    this.isRunning = false;
  }

  setParameterData(parameterData) {
    this.parameterData = parameterData;
  }

  async initialize(configData) {
    this.configData = configData;
    this.cache = {};
    this.rendererProgressBySeed = {};
    this.numFinishedRendering = 0;

    // Headless puppeteer cluster for rendering
    this.cluster = await Cluster.launch({ ...CLUSTER_PARAMS, maxConcurrency: configData.numRenderInstances });

    // TODO Error handling
    this.cluster.task(async ({ page, data }) => {
      try {
        return await renderTask({ page, data }).then(data => data).catch(error => console.error(error));
      } catch (error) {
        console.error(error);
      }
    });
    this.isInitialized = true;
  }

  addRenderToQueue({ seed }) {
    // Is seed already rendered, or in progress?
    if (this.cache[seed] || this.rendererProgressBySeed[seed]) return;

    this.rendererProgressBySeed[seed] = "queued";

    const { configData, parameterData } = this;
    this.cluster.execute({ seed, configData, parameterData }).then(renderResult => {
      this.cache[seed] = renderResult;
      this.rendererProgressBySeed[seed] = "finished";
      this.numFinishedRendering += 1;
    });
  }

  getRenderData({ seed }) {
    return this.cache ? this.cache[seed] : undefined;
  }

  getNumFinishedRendering() {
    return this.numFinishedRendering;
  }

  getRendererProgress() {
    return this.rendererProgressBySeed;
  }

  isIdle() {
    return !this.cluster || (this.cluster.jobQueue.size() === 0 && this.cluster.workersBusy.length === 0);
  }

  // TODO Rewrite so that a new render handler is created
  async dispose() {
    renderHandler = undefined;
    try {
      if (!this.cluster) return;
      const queueArray = this.cluster.jobQueue.list;
      while (queueArray.length > 0) queueArray.pop();
      await this.cluster.close();
      this.jobQueue
    } catch (error) {
      console.error(error);
    }
  }

}
let renderHandler;

function getRenderHandler() {
  if (!renderHandler) renderHandler = new RenderHandler();
  return renderHandler;
}

async function renderTask({ page, data }) {
  const { configData, parameterData, seed } = data;
  let { canvasSelector, thumbRes: resolution, url: baseUrl } = configData;

  await page.on('pageerror', async error => {
    console.error(error);
    return await page.close();
  });

  resolution = parseInt(resolution);

  page.setViewport({ width: resolution, height: resolution });

  const hash = generateTxHash(seed);
  const url = new URL(baseUrl);
  const urlParams = new URLSearchParams({ seed, resolution, hash });
  const parameterString = hasValue(parameterData) ? `&parameters=${encodeURIComponent(JSON.stringify(parameterData))}` : "";
  url.search = urlParams.toString() + parameterString;

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

  urlParams.delete("resolution");
  url.search = urlParams.toString() + parameterString;

  return { image: imageBase64, width, height, parameters, url: url.toString() };
}

export default getRenderHandler;
