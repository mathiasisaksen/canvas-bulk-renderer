import renderHandler from "@/services/render-handler-cluster";
import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  await renderHandler.dispose();
  res.send();
});

export default router.handler();
