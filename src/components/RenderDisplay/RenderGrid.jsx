import RenderBox from '@/components/RenderDisplay/RenderBox'
import useConfig from '@/store/config-store';
import useRenderData from '@/store/render-data-store';
import useUI from '@/store/ui-store';
import usePageNumber from '@/store/use-page-number';
import range from '@/utils/range';
import { Flex, useColorModeValue, useInterval } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'

export default function RenderGrid() {
  const intervalRef = useRef();

  const pageNumber = usePageNumber((state) => state.pageNumber);
  const { rendersPerPage } = useConfig((state) => state.getConfig());

  const [renderProgress, fetchRenderProgress, fetchIsRendererIdle, isRendererIdle] = useRenderData((state) => [state.renderProgress, state.fetchRenderProgress, state.fetchIsRendererIdle, state.isRendererIdle()]);

  //useInterval(fetchRenderProgress, 1000)
  useEffect(() => {
    console.log("useeffect");
    intervalRef.current = setInterval(() => {
      fetchRenderProgress();
      fetchIsRendererIdle();

      return () => clearInterval(intervalRef.current);
    }, 1000)
  }, [pageNumber])

  useEffect(() => {
    if (isRendererIdle) clearInterval(intervalRef.current);
  }, [pageNumber, isRendererIdle]);

  const lowerSeed = (pageNumber - 1) * rendersPerPage;
  const upperSeed = lowerSeed + rendersPerPage - 1;

  return (
    <Flex w="100%" h="auto" wrap="wrap" justify="flex-start">
      {range(lowerSeed, upperSeed).map(seed => <RenderBox renderProgress={renderProgress[seed]} key={seed} seed={seed} />)}
    </Flex>
  )
}
