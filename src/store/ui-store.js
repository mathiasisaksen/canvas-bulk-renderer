import { MAX_GRID_COLUMNS } from "@/consts/constants";
import { defaultUI } from "@/consts/defaults";
import produce from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUI = create(
  persist(
    (set, get) => ({
      gridColumns: defaultUI.gridColumns,
      renderAspectRatio: 1,
      aspectRatioIsSet: false,
      menuIsOpen: true,
      isFirstLoad: true,
      setGridColumns: value => set(produce(state => { state.gridColumns = Math.max(1, Math.min(MAX_GRID_COLUMNS, value)) })),
      setAspectRatio: value => !get().aspectRatioIsSet && set(produce(state => { state.renderAspectRatio = value; state.aspectRatioIsSet = true; })),
      toggleMenuIsOpen: () => set(produce(state => { state.menuIsOpen = !state.menuIsOpen; })),
      setIsFirstLoad: value => (set(produce(state => { state.isFirstLoad = value; })))
    }),
    {
      name: "ui",
      allowList: ["gridColumns", "renderAspectRatio", "isFirstLoad"]
    }
));

export default useUI;