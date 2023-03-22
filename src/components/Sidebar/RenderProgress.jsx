import useConfig from '@/store/config-store';
import useUI from '@/store/ui-store'
import React from 'react'
import { Progress, Text, useColorModeValue, useInterval, VStack } from '@chakra-ui/react';
import api from '@/services/api';

export default function RenderProgress() {
  const [numFinishedRendering, setNumFinishedRendering] = useUI(state => [state.numFinishedRendering, state.setNumFinishedRendering]);
  const { batchSize } = useConfig(state => state.getConfig());
  const bg = useColorModeValue("#00000033", "#ffffff11");

  useInterval(() => {
    api.get("/api/render/num-finished").then(({ data }) => setNumFinishedRendering(data.numFinished));
  }, 1000);

  return (
    <VStack w="100%" p="8" boxShadow={`0 0 10px ${bg}`} gap="4">
      <Progress w="100%" size="xs" colorScheme="pink" min={0} max={batchSize} value={numFinishedRendering} hasStripe={true} isAnimated={true} />
      <Text>{numFinishedRendering} of {batchSize} finished...</Text>
      <Text>Estimated time remaining: 2 min 35 seconds</Text>
    </VStack>
  )
}
