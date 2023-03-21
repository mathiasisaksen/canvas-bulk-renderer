import renderHandler from "@/services/render-handler-cluster";
import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  const { seed } = req.query;
  const render = await renderHandler.executeRender({ seed });

  res.status(200).send(render);
});

export default router.handler();
