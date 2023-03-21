import defaults from "@/consts/defaults";
import { useGlobalState } from "@/context/GlobalProvider";

export default function useConfigData() {
  const [url] = useGlobalState("url", defaults.url);
  const [rendersPerPage] = useGlobalState("rendersPerPage", defaults.rendersPerPage);
  const [thumbRes] = useGlobalState("thumbRes", defaults.thumbRes);
  const [canvasSelector] = useGlobalState("canvasSelector", defaults.canvasSelector);
  const [numRenderInstances] = useGlobalState("numRenderInstances", defaults.numRenderInstances);

  return { url, rendersPerPage, thumbRes, canvasSelector, numRenderInstances };
}