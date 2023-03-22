import renderHandler from "@/services/render-handler-cluster";
import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  const { range } = req.body;
  
  const [lower, upper] = range;
  console.log('[lower, upper]: ', [lower, upper]);

  const arr = [];
  for (let i = lower; i <= upper; i++) {
    arr.push(renderHandler.executeRender({ seed: i }));
  }

  
  res.status(202).send();
  await Promise.all(arr);
});

export default router.handler();
