import getRenderHandler from "@/services/render-handler-cluster";
import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  const renderHandler = getRenderHandler();

  await renderHandler.dispose();
  
  res.send();
});

export default router.handler();
