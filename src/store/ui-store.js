import { defaultUI } from "@/consts/defaults";
import produce from "immer";
import { create } from "zustand";

const useUI = create((set, get) => ({
  renderEnabled: false,
  gridColumns: defaultUI.gridColumns,
  numFinishedRendering: 0,
  renderAspectRatio: 1,
  aspectRatioIsSet: false,
  enableRender: () => set(produce(state => { state.renderEnabled = true })),
  disableRender: () => set(produce(state => { state.renderEnabled = false })),
  setGridColumns: value => set(produce(state => { state.gridColumns = value })),
  setNumFinishedRendering: value => set(produce(state => { state.numFinishedRendering = value })),
  setAspectRatio: value => !get().aspectRatioIsSet && set(produce(state => { state.renderAspectRatio = value; state.aspectRatioIsSet = true; }))
}));

export default useUI;