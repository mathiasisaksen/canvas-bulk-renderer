
import Pagination from '@/components/RenderDisplay/Pagination'
import RenderBox from '@/components/RenderDisplay/RenderBox'
import { Flex, useColorModeValue, VStack } from '@chakra-ui/react'
import React from 'react'

export default function RenderDisplay() {
  const borderCol = useColorModeValue("#00000033", "#ffffff11");
  return (
    <VStack flex={1} w="100%" justify="space-between" pt="8" ml="3">
      <Flex flex={1} w="100%" direction="row" align="start" justify="center" wrap="wrap" pt="2" overflowY="scroll" sx={{ "::-webkit-scrollbar": { display: "none" } }} boxShadow={`0 0 20px ${borderCol}`}>
        {Array(1).fill().map((_, i) => <RenderBox key={i} seed={i} />)}
      </Flex>
      <Pagination />
    </VStack>
    
  )
}
