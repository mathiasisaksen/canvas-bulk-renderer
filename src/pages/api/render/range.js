import renderHandler from "@/services/render-handler-cluster";
import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  const { range } = req.body;
  
  const [lower, upper] = range;
  console.log('[lower, upper]: ', [lower, upper]);

  const arr = [];
  for (let i = lower; i <= upper; i++) {
    console.log('i: ', i);
    arr.push(renderHandler.executeRender({ seed: i }));
  }

  
  await Promise.all(arr);
  res.status(202).send();
});

export default router.handler();
