import api from "@/services/api";

export const renderRange = async (startSeed, numToRender) => await api.post("/api/render/range", { range: [startSeed, startSeed + numToRender - 1] });