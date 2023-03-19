const puppeter = require("puppeteer");

export default async function handler(req, res) {
  const { seed } = req.query;

  const browser = await puppeter.launch({
    ignoreDefaultArgs: ["--disable-gpu"],
    args: ['--enable-webgl', "--use-gl=angle"]
  });

  const page = await browser.newPage();
  page.setViewport({ width: 450, height: 450 });
  await page.goto(`http://localhost:8764/?seed=${seed}}&res=450`);
  await page.waitForFunction(() => document.complete == true, {
    polling: 100,
    timeout: 0,
  });

  const dataUrl = await page.evaluate(() => {
    let c = document.querySelector("canvas");
    return c.toDataURL();
  });

  let base64String = dataUrl.slice(dataUrl.indexOf(",") + 1);

  const parameters = await page.evaluate(() => window.p);
  const features = await page.evaluate(() => window.features);

  await browser.close();

  res.status(200).json({ seed, parameters, features, image: base64String });
}
