import RenderHandler from "@/services/render-handler";
import puppeter from "puppeteer";

const rh = new RenderHandler();
rh.initialize().then(() => console.log("Initialized"));

export default async function handler(req, res) {
  const { seed, canvasSelector } = req.query;
  
  const render = await rh.executeRender({ seed, canvasSelector, resolution: 450, baseUrl: "http://localhost:8764" });

  res.status(200).json({ seed, ...render });
}
