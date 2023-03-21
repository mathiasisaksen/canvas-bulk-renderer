
import Pagination from '@/components/RenderDisplay/Pagination'
import RenderBox from '@/components/RenderDisplay/RenderBox'
import RenderWindow from '@/components/RenderDisplay/RenderWindow';
import { Flex, useColorModeValue, VStack } from '@chakra-ui/react'
import React from 'react'

export default function RenderDisplay() {
  return (
    <VStack flex={1} w="100%" justify="space-between" pt="8" ml="3">
      <RenderWindow />
      <Pagination />
    </VStack>
    
  )
}
