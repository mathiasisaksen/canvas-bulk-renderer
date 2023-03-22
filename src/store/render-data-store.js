import rs from "@/consts/renderer-states";
import api from "@/services/api";
import produce from "immer";
import { create } from "zustand";

const useRenderData = create((set, get) => ({
  rendererState: rs.CONFIG,
  renderProgress: {},
  
  fetchRenderProgress: () => {
    api.get("/api/render/progress").then(({ data }) => set(produce(state => { state.renderProgress = data.renderProgress ?? {} })));
  },
  fetchIsRendererIdle: () => api.get("/api/render/check-is-idle").then(({ data }) => set(produce(state => { if(data.isIdle) state.rendererState = rs.IDLE }))),

  setRendererState: value => set(produce(state => { state.rendererState = value })),
  isRendererEnabled: () => { const state = get().rendererState; return state !== rs.CONFIG && state !== rs.INITIALIZING },
  isRendererIdle: () => get().rendererState === rs.IDLE
}));

export default useRenderData;