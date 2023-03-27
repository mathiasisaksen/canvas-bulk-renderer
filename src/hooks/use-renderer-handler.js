
import { initializeRender, renderRange } from '@/api/renderer';
import rs from '@/consts/renderer-states';
import useConfig from '@/store/config-store';
import useParameterPanel from '@/store/parameter-panel-store';
import useRenderData from '@/store/render-data-store';
import usePageNumber from '@/store/page-number-store';
import { useToast } from '@chakra-ui/react'

export default function useRendererHandler() {
  const toast = useToast();
  let [setRendererState, isRendererEnabled, setRendererTimeStarted, disableRenderer] = useRenderData((state) => [state.setRendererState, state.isRendererEnabled(), state.setRendererTimeStarted, state.disableRenderer]);
  const setPageNumber = usePageNumber((state) => state.setPage);
  const parameterPanelData = useParameterPanel((state) => state.getProcessedPanelObject());
  const configData = useConfig((state) => state.getConfig());

  async function startRenderer() {

    if (isRendererEnabled) {
      toast({ title: "Renderer already running", status: "info" });
      return;
    }

    try {
      setRendererState(rs.INITIALIZING);
      await initializeRender({ configData, parameterPanelData });
    } catch (error) {
      const title = error.response?.data?.error ?? "Error when initializing render engine: " + error.message;
      toast({ title, status: "error" });
      setRendererState(rs.CONFIG);
      return;
    }

    try {
      const { renderMode, batchSize, startSeed, prerenderPages, rendersPerPage } = configData;

      if (renderMode === "prerender") {
        await renderRange(startSeed, batchSize);
      } else if (renderMode === "continuous") {
        await renderRange(startSeed, rendersPerPage * (1 + prerenderPages));
      } else {
        throw new Error("Invalid render mode");
      }
      setRendererState(rs.RENDERING);
      setRendererTimeStarted();
    } catch (error) {
      toast({ title: error.message, status: "error" });
      setRendererState(rs.CONFIG);
    }
  }

  function stopRenderer() {
    disableRenderer();
    setPageNumber(1);
  }

  return { startRenderer, stopRenderer };
}