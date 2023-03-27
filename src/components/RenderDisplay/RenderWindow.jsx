import RenderGrid from '@/components/RenderDisplay/RenderGrid';
import useRenderData from '@/store/render-data-store';
import { Flex, useColorModeValue } from '@chakra-ui/react'

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
