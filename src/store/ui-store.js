import { defaultUI } from "@/consts/defaults";
import produce from "immer";
import { create } from "zustand";

const useUI = create((set) => ({
  renderEnabled: false,
  gridColumns: defaultUI.gridColumns,
  enableRender: () => set(produce(state => { state.renderEnabled = true })),
  disableRender: () => set(produce(state => { state.renderEnabled = false })),
  setGridColumns: value => set(produce(state => { state.gridColumns = value }))
}));

export default useUI;