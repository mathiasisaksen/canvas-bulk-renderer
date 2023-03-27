
import rs from '@/consts/renderer-states';
import useRendererHandler from '@/hooks/use-renderer-handler';
import useConfig from '@/store/config-store';
import useRenderData from '@/store/render-data-store';
import { CloseIcon, StarIcon } from '@chakra-ui/icons';
import { Button, useColorModeValue, useToast, useToken } from '@chakra-ui/react';
import { useState } from 'react';

export default function SubmitButton() {
  let [rendererState, isRendererEnabled, numFinishedRendering, renderStartTime] = useRenderData((state) => [state.rendererState, state.isRendererEnabled(), state.numFinishedRendering, state.renderStartTime]);
  const configData = useConfig((state) => state.getConfig());
  const [progressColorLight, progressColorDark] = useToken("colors", ["pink.600", "pink.400"]);
  const progressColor = useColorModeValue(progressColorLight, progressColorDark);
  const [isHover, setIsHover] = useState(false);
  const { startRenderer, stopRenderer } = useRendererHandler();
  const { batchSize } = configData;
  const isPrerender = configData.renderMode === "prerender";

  const percentageFinished = 100 * numFinishedRendering / batchSize;
  const progressGradient = !isRendererEnabled || !isPrerender ? null : `linear-gradient(90deg, transparent 0%, transparent ${percentageFinished}%, ${progressColor} ${percentageFinished}%, ${progressColor} 100%)`;

  const icon = !isRendererEnabled ? <StarIcon /> :
               !isHover && isPrerender ? null : <CloseIcon />;

  const buttonText = formatButtonText();

  return (
    <Button isLoading={rendererState === rs.INITIALIZING} colorScheme="teal" w="100%" mt="2" mb={{ base: "8", md: "0" }} leftIcon={icon} onClick={isRendererEnabled ? stopRenderer : startRenderer} bgGradient={progressGradient} onPointerEnter={() => setIsHover(true)} onPointerLeave={() => setIsHover(false)}>{buttonText}</Button>
  )

  function formatButtonText() {
    const secondsPerRender =  1/1000 * (performance.now() - renderStartTime) / numFinishedRendering;
    const secondsRemaining = (batchSize - numFinishedRendering)*secondsPerRender;
  
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = Math.round(secondsRemaining % 60);

    const timeRemaining = !numFinishedRendering ? "..." : (hours > 0 ? `${hours} hours, ` : "") + (minutes > 0 ? `${minutes} minutes, ` : "") + `${seconds} seconds`;
  
    return !isRendererEnabled ? "Render" :
      isHover || !isPrerender ? "Stop" :
      `${numFinishedRendering} / ${batchSize} (${timeRemaining})`;
  
  }
}
