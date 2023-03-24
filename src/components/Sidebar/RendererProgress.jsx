import useConfig from '@/store/config-store';
import React from 'react'
import { Progress, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import useRenderData from '@/store/render-data-store';

function formatTimeRemaining(secondsRemaining) {
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = Math.round(secondsRemaining % 60);

  return (hours > 0 ? `${hours} hours, ` : "") + (minutes > 0 ? `${minutes} minutes, ` : "") + `${seconds} seconds`;
}

export default function RendererProgress() {
  const [numFinishedRendering, renderStartTime] = useRenderData(state => [state.numFinishedRendering, state.renderStartTime]);
  const { batchSize } = useConfig(state => state.getConfig());
  const bg = useColorModeValue("#00000033", "#ffffff11");

  const secondsPerRender =  1/1000 * (performance.now() - renderStartTime) / numFinishedRendering;
  const secondsRemaining = (batchSize - numFinishedRendering)*secondsPerRender;

  //const timeRemaining = numFinishedRendering === 0 ? "..." : (new Date(1000 * secondsRemaining)).toISOString().slice(11, 19);
  const timeRemaining = !numFinishedRendering ? "..." : formatTimeRemaining(secondsRemaining);

  return (
    <VStack w="100%" p="8" boxShadow={`0 0 10px ${bg}`} gap="4">
      <Progress w="100%" size="xs" colorScheme="pink" min={0} max={batchSize} value={numFinishedRendering} hasStripe={true} isAnimated={true} />
      <Text>{numFinishedRendering} of {batchSize} finished</Text>
      <Text>Estimated time remaining:</Text>
      <Text>{timeRemaining}</Text>
    </VStack>
  )
}
