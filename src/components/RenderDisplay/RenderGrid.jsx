import RenderBox from '@/components/RenderDisplay/RenderBox'
import useConfig from '@/store/config-store';
import useRenderData from '@/store/render-data-store';
import useUI from '@/store/ui-store';
import usePageNumber from '@/store/page-number-store';
import range from '@/utils/range';
import { Flex, useColorModeValue, useInterval } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'

export default function RenderGrid() {
  const intervalRef = useRef();
  const gridRef = useRef();

  const pageNumber = usePageNumber((state) => state.pageNumber);
  const { rendersPerPage, startSeed, renderMode, batchSize } = useConfig((state) => state.getConfig());

  const [rendererProgress, fetchRendererUpdate, isRendererIdle] = useRenderData((state) => [state.rendererProgress, state.fetchRendererUpdate, state.isRendererIdle()]);
  console.log("Loop");
  //useInterval(fetchRendererProgress, 1000)
  useEffect(() => {
    if (isRendererIdle) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        fetchRendererUpdate();
      }, 1000)  
    }
    
    return () => clearInterval(intervalRef.current);
  }, [pageNumber, isRendererIdle, fetchRendererUpdate])

  const lowerSeed = startSeed + (pageNumber - 1) * rendersPerPage;
  let upperSeed = lowerSeed + rendersPerPage - 1;

  if (renderMode === "prerender") upperSeed = Math.min(upperSeed, startSeed + batchSize - 1);

  return (
    <Flex w="100%" h="auto" wrap="wrap" justify="flex-start" ref={gridRef}>
      {range(lowerSeed, upperSeed).map(seed => <RenderBox rendererProgress={rendererProgress[seed]} key={seed} seed={seed} />)}
    </Flex>
  )
}
