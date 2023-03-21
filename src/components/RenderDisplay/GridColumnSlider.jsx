import useUI from '@/store/ui-store';
import { Flex, HStack, Icon, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import React from 'react';
import { BsGrid3X3Gap } from 'react-icons/bs';
import { TfiLayoutGrid2, TfiLayoutGrid4, TfiLayoutGrid2Alt, TfiLayoutGrid4Alt } from 'react-icons/tfi'

export default function GridColumnSlider() {
  const [renderEnabled, gridColumns, setGridColumns] = useUI((state) => [state.renderEnabled, state.gridColumns, state.setGridColumns]);

  return (
    <HStack flex={1} justify="center">
      <Icon as={TfiLayoutGrid2Alt} />
      <Slider isDisabled={!renderEnabled} value={gridColumns} min={1} max={15} step={1} w="50%" onChange={value => setGridColumns(value)}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Icon as={TfiLayoutGrid4Alt} />
    </HStack>
  )
}
