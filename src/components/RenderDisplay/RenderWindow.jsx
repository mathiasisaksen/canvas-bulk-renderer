import RenderBox from '@/components/RenderDisplay/RenderBox'
import RenderGrid from '@/components/RenderDisplay/RenderGrid';
import useConfig from '@/store/config-store';
import useRenderData from '@/store/render-data-store';
import useUI from '@/store/ui-store';
import usePageNumber from '@/store/use-page-number';
import range from '@/utils/range';
import { Flex, useColorModeValue, useInterval } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'

export default function RenderWindow() {
  const boxShadowColor = useColorModeValue("#00000033", "#ffffff11");
  const isRendererEnabled = useRenderData((state) => state.isRendererEnabled());
  
  return (
    <Flex 
      flex={1} 
      w="100%" 
      direction="column" 
      p="2" 
      overflowY="scroll" 
      sx={{ "::-webkit-scrollbar": { display: "none" } }} 
      boxShadow={`0 0 20px ${boxShadowColor}`}
    >
      {isRendererEnabled ? <RenderGrid /> : null}
    </Flex>
  )
}
