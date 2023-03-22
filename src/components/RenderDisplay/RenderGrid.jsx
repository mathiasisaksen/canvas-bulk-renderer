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

  const [renderState, fetchRenderState, rendererIsIdle, fetchIsRendererIdle] = useRenderData((state) => [state.renderState, state.fetchRenderState, state.rendererIsIdle, state.fetchIsRendererIdle]);
  console.log('renderState: ', renderState);
  console.log('rendererIsIdle: ', rendererIsIdle);

  //useInterval(fetchRenderState, 1000)
  useEffect(() => {
    console.log("useeffect");
    intervalRef.current = setInterval(() => {
      fetchRenderState();
      fetchIsRendererIdle();

      return () => clearInterval(intervalRef.current);
    }, 1000)
  }, [pageNumber])

  useEffect(() => {
    if (rendererIsIdle) clearInterval(intervalRef.current);
  }, [pageNumber, rendererIsIdle]);

  const lowerSeed = (pageNumber - 1) * rendersPerPage;
  const upperSeed = lowerSeed + rendersPerPage - 1;

  return (
    <Flex w="100%" h="auto" wrap="wrap" justify="flex-start">
      {range(lowerSeed, upperSeed).map(seed => <RenderBox renderState={renderState[seed]} key={seed} seed={seed} />)}
    </Flex>
  )
}
