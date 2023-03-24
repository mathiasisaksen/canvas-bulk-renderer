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
      setGridColumns: value => set(produce(state => { state.gridColumns = value })),
      setAspectRatio: value => !get().aspectRatioIsSet && set(produce(state => { state.renderAspectRatio = value; state.aspectRatioIsSet = true; }))
    }),
    {
      name: "ui",
      allowList: ["gridColumns", "renderAspectRatio"]
    }
));

export default useUI;