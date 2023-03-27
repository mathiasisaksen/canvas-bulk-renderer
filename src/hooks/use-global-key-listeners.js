import useRendererHandler from "@/hooks/use-renderer-handler";
import useRenderData from "@/store/render-data-store";
import useUI from "@/store/ui-store";
import usePageNumber from "@/store/page-number-store";
import { useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";

export default function useGlobalKeyListeners() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { startRenderer } = useRendererHandler();

  async function handler(e) {
    if (!e.ctrlKey) return;
    
    const { toggleMenuIsOpen, gridColumns, setGridColumns } = useUI.getState();
    const isRendererEnabled = useRenderData.getState().isRendererEnabled();
    const { pageNumber, setPage } = usePageNumber.getState();

    if (e.key === "m") {
      toggleMenuIsOpen();
    } else if (e.key === "j") {
      isRendererEnabled && setPage(pageNumber - 1);
    } else if (e.key === "k") {
      isRendererEnabled && setPage(pageNumber + 1);
    } else if (e.key === "-") {
      isRendererEnabled && setGridColumns(gridColumns + 1);
    } else if (e.key === "+") {
      isRendererEnabled && setGridColumns(gridColumns - 1);
    } else if (e.key === "d") {
      toggleColorMode();
    } else if (e.key === "Enter") {
      console.log("Enter");
      await startRenderer();
    }
  } 

  useEffect(() => {
    document.addEventListener("keyup", handler);
    
    return () => document.removeEventListener("keyup", handler);
  
  }, [colorMode, startRenderer])
}