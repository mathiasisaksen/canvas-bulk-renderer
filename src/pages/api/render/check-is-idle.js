import getRenderHandler from "@/services/render-handler-cluster";
import { createRouter } from 'next-connect';

const router = createRouter();

router.get(async (req, res) => {
  const renderHandler = getRenderHandler();
  res.send({ isIdle: renderHandler.isIdle() });
});

export default router.handler();
