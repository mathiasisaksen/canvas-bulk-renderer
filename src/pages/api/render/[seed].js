import getRenderHandler from "@/services/render-handler-cluster";
import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  const { seed } = req.query;
  
  const renderHandler = getRenderHandler();

  if (!renderHandler.isInitialized) return res.status(400).send({ error: "Renderer not initialized" });

  res.status(202).send();
  
  await renderHandler.addRenderToQueue({ seed });

});

router.get(async (req, res) => {
  const { seed } = req.query;

  const renderHandler = getRenderHandler();

  const renderData = renderHandler.getRenderData({ seed });
  if (!renderData) return res.status(400).send({ error: `No render data found for seed ${seed}`});

  res.send(renderData);
});

export default router.handler();
