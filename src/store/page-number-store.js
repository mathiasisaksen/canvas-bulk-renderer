import { renderRange } from "@/api/renderer";
import rs from "@/consts/renderer-states";
import useConfig from "@/store/config-store";
import useRenderData from "@/store/render-data-store";
import produce from "immer";
import { create } from "zustand";

const usePageNumber = create((set, get) => ({
  pageNumber: 1,
 
  increment: () => set(produce(state => get().setPage(state.pageNumber + 1))),
  decrement: () => set(produce(state => get().setPage(state.pageNumber - 1))),

  setPage: (newPage) => set(produce(state => {
    const { renderMode, startSeed, prerenderPages, batchSize, rendersPerPage } = useConfig.getState().getConfig();
    const setRendererState = useRenderData.getState().setRendererState;

    const maxPageBatch = Math.ceil(batchSize / rendersPerPage);

    newPage = parseInt(newPage);
    if (renderMode === "continuous" || (newPage > 0 && newPage <= maxPageBatch)) {
      state.pageNumber = newPage;  
    }

    if (renderMode === "continuous") {
      renderRange(startSeed + (newPage - 1)*rendersPerPage, (1 + prerenderPages)*rendersPerPage).then(() => setRendererState(rs.RENDERING));
    }

  })),
}));

export default usePageNumber;