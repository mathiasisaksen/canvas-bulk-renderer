import renderHandler from "@/services/render-handler";
import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  const { seed } = req.query;
  const data = req.body;
  
  const render = await renderHandler.executeRender({ seed, ...data });

  res.status(200).json({ data, ...render });
});

export default router.handler();
