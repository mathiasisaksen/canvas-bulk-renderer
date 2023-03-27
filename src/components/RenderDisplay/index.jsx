
import GridColumnSlider from '@/components/RenderDisplay/GridColumnSlider';
import Pagination from '@/components/RenderDisplay/Pagination'
import RenderWindow from '@/components/RenderDisplay/RenderWindow';
import MenuButton from '@/components/Sidebar/MenuButton';
import useUI from '@/store/ui-store';
import { HStack, VStack } from '@chakra-ui/react'
import React from 'react'

export default function RenderDisplay() {
  const menuIsOpen = useUI((state) => state.menuIsOpen);
  return (
    <VStack flex={1} w="100%" justify="space-between" gap="5" opacity={{ base: menuIsOpen ? 0 : 1, md: 1 }}>
      <RenderWindow />
      <HStack w="100%">
        <HStack flex={1}>
          {menuIsOpen ? null : <MenuButton />}
        </HStack>
        <Pagination />
        <GridColumnSlider />
      </HStack>
    </VStack>

  )
}
