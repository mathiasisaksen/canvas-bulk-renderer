import { defaultConfig } from "@/consts/defaults";
import api from "@/services/api";
import renderHandler from "@/services/render-handler-cluster";

import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  let { configData, parameterPanelData } = req.body;

  configData = { ...defaultConfig, ...configData };
  console.log('configData: ', configData);

  // Check that specified server is running
  try {
    await api.get(configData.url);
  } catch (error) {
    return res.status(400).send({ error: "Could not connect to server URL. Ensure that the server is running" });
  }

  await renderHandler.dispose();

  renderHandler.setParameterData(parameterPanelData);
  await renderHandler.initialize(configData);
  
  res.send();
});

export default router.handler();