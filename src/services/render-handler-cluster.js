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
      /*try {
        return await renderTask({ page, data });
      } catch (error) {
        console.log(error);
      }*/
      return renderTask({ page, data }).then(data => data).catch(error => console.error(error));
    });
    this.isInitialized = true;
  }

  addRenderToQueue({ seed }) {
    // Is seed already rendered, or in progress?
    if (this.cache[seed] || this.rendererProgressBySeed[seed]) return;

    this.rendererProgressBySeed[seed] = "queued";

    const { configData, parameterData } = this;
    this.cluster.execute({ seed, configData, parameterData }).then( renderResult => {
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
    //if (!this.isInitialized) return;
    renderHandler = undefined;
    try {
      this.cluster.close().then().catch(error => console.error(error));
    } catch (error) {
      console.error(error);
    }
    
    /*this.isInitialized = false;
    delete this.configData;
    delete this.parameterData;
    delete this.cache;
    delete this.rendererProgressBySeed;
    delete this.numFinishedRendering;
    delete this.cluster;*/
  }

}
let renderHandler;

function getRenderHandler() {
  if (!renderHandler) renderHandler = new RenderHandler();
  return renderHandler;
}

//const renderHandler = new RenderHandler();

async function renderTask({ page, data }) {
  const { configData, parameterData, seed } = data;
  let { canvasSelector, thumbRes: resolution, url: baseUrl } = configData;

  await page.on('pageerror', async msg => {
    console.log(msg);
    return await page.close();
  });

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
}

export default getRenderHandler;
