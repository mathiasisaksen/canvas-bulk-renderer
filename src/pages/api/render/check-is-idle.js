import renderHandler from "@/services/render-handler-cluster";
import { createRouter } from 'next-connect';

const router = createRouter();

router.get(async (req, res) => {
  res.send({ isIdle: renderHandler.isIdle() });
});

export default router.handler();
