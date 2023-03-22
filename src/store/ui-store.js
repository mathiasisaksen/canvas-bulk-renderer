import { defaultUI } from "@/consts/defaults";
import produce from "immer";
import { create } from "zustand";

const useUI = create((set, get) => ({
  gridColumns: defaultUI.gridColumns,
  numFinishedRendering: 0, // TODO Move
  renderAspectRatio: 1,
  aspectRatioIsSet: false,
  setGridColumns: value => set(produce(state => { state.gridColumns = value })),
  setNumFinishedRendering: value => set(produce(state => { state.numFinishedRendering = value })),
  setAspectRatio: value => !get().aspectRatioIsSet && set(produce(state => { state.renderAspectRatio = value; state.aspectRatioIsSet = true; }))
}));

export default useUI;