import renderHandler from "@/services/render-handler-cluster";
import { createRouter } from 'next-connect';

const router = createRouter();

router.get(async (req, res) => {
  res.send({ renderProgress: renderHandler.getRenderProgress() });
});

export default router.handler();
