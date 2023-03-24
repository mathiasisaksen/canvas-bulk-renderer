import api from "@/services/api";

export const renderRange = async (startSeed, numToRender) => await api.post("/api/render/range", { range: [startSeed, startSeed + numToRender - 1] });

export const fetchRendererProgress = async () => await api.get("/api/render/progress");

export const fetchIsRendererIdle = async () => await api.get("/api/render/check-is-idle");

export const fetchNumFinishedRendering = async () => await api.get("/api/render/num-finished");

export const shutDownRenderer = async () => await api.post("/api/render/shutdown");