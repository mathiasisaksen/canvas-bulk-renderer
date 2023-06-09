import api from "@/services/api";
import getRenderHandler from "@/services/render-handler";

import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  let { configData, parameterPanelData } = req.body;

  const renderHandler = getRenderHandler();

  // Check that specified server is running
  try {
    await api.get(configData.url);
  } catch (error) {
    return res.status(400).send({ error: "Could not connect to server URL. Ensure that the server is running" });
  }

  //await renderHandler.dispose();

  renderHandler.setParameterData(parameterPanelData);
  await renderHandler.initialize(configData);
  
  res.send();
});

export default router.handler();