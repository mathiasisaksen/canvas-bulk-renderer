import { fetchIsRendererIdle, fetchNumFinishedRendering, fetchRendererProgress, shutDownRenderer } from "@/api/renderer";
import rs from "@/consts/renderer-states";
import api from "@/services/api";
import produce from "immer";
import { create } from "zustand";

const initialState = {
  rendererState: rs.CONFIG,
  rendererProgress: {},
  numFinishedRendering: 0, // TODO Move
  renderStartTime: null,
}

const useRenderData = create((set, get) => ({
  ...initialState,

  fetchRendererProgress: () => {
    fetchRendererProgress().then(({ data }) => set(produce(state => { state.rendererProgress = data.rendererProgress ?? {} })));
  },
  fetchIsRendererIdle: () => fetchIsRendererIdle().then(({ data }) => set(produce(state => { if(data.isIdle) state.rendererState = rs.IDLE }))),
  fetchNumFinishedRendering: () => fetchNumFinishedRendering().then(({ data }) => set(produce(state => { state.numFinishedRendering = data.numFinished ?? 0 }))),
  fetchRendererUpdate: () => { get().fetchRendererProgress(); get().fetchIsRendererIdle(); get().fetchNumFinishedRendering() },
  
  setRendererState: value => set(produce(state => { state.rendererState = value })),
  setRendererTimeStarted: () => set(produce(state => { state.renderStartTime = performance.now() })),
  isRendererEnabled: () => { const state = get().rendererState; return state !== rs.CONFIG && state !== rs.INITIALIZING },
  isRendererIdle: () => get().rendererState === rs.IDLE,
  disableRenderer: () => { shutDownRenderer().then(() => set(initialState)) }
}));

export default useRenderData;