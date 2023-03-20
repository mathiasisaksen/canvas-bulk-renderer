import renderHandler from "@/services/render-handler";

import { createRouter } from 'next-connect';

const router = createRouter();

router.post(async (req, res) => {
  const { numBrowsers } = req.query;
  await renderHandler.dispose();
  await renderHandler.initialize({ numBrowsers });
  console.log('initialize');
  res.send();
});

export default router.handler();