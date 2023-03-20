import renderHandler from "@/services/render-handler";
import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  const { range, ...data } = req.body;
  
  const [lower, upper] = range;

  const arr = [];
  for (let i = lower; i <= upper; i++) {
    arr.push(renderHandler.executeRender({ seed: i, ...data }));
  }

  await Promise.all(arr);
  
  res.status(200).json();
});

export default router.handler();
