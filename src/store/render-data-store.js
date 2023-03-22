import api from "@/services/api";
import produce from "immer";
import { create } from "zustand";

const useRenderData = create((set) => ({
  renderState: "config",
  rendererIsIdle: false,
  renderState: {},
  fetchRenderState: () => {
    api.get("/api/render/render-state").then(({ data }) => set(produce(state => { state.renderState = data.renderState ?? {} })));
  },
  fetchIsRendererIdle: () => api.get("/api/render/check-is-idle").then(({ data }) => set(produce(state => { state.rendererIsIdle = data.isIdle ?? true }))),
  setIsRendererIdle: value => set(produce(state => { state.rendererIsIdle = value })),


}));

export default useRenderData;