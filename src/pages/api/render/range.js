import getRenderHandler from "@/services/render-handler";
import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  const { range } = req.body;
  const renderHandler = getRenderHandler();

  if (!renderHandler.isInitialized) return res.status(400).send({ error: "Renderer not initialized" });
  
  const [lower, upper] = range;

  const arr = [];
  for (let i = lower; i <= upper; i++) {
    //arr.push(renderHandler.addRenderToQueue({ seed: i }));
    renderHandler.addRenderToQueue({ seed: i });
  }

  res.status(202).send();
  //await Promise.all(arr);
});

export default router.handler();
