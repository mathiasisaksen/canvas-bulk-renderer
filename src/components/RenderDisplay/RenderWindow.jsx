import RenderBox from '@/components/RenderDisplay/RenderBox'
import { useGlobalState } from '@/context/GlobalProvider';
import { Flex, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export default function RenderWindow() {
  const boxShadowColor = useColorModeValue("#00000033", "#ffffff11");
  const [renderEnabled] = useGlobalState("renderEnabled", false);
  const [pageNumber] = useGlobalState("pageNumber", 1);
  
  return (
    <Flex flex={1} w="100%" direction="row" align="start" justify="center" wrap="wrap" pt="2" overflowY="scroll" sx={{ "::-webkit-scrollbar": { display: "none" } }} boxShadow={`0 0 20px ${boxShadowColor}`}>
        {renderEnabled && Array(20).fill().map((_, i) => <RenderBox key={i} seed={i + 20*(pageNumber - 1) + 0} />)}
      </Flex>
  )
}
