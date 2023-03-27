import MenuButton from '@/components/Sidebar/MenuButton';
import { MAX_GRID_COLUMNS } from '@/consts/constants';
import useRenderData from '@/store/render-data-store';
import useUI from '@/store/ui-store';
import { HStack, IconButton, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import React from 'react';
import { TfiLayoutGrid2Alt, TfiLayoutGrid4Alt } from 'react-icons/tfi'

// Client side dictionary of finished renders
// At every get finished-renders, get diff from last time

export default function GridColumnSlider() {
  const [gridColumns, setGridColumns] = useUI((state) => [state.gridColumns, state.setGridColumns]);
  const isRendererEnabled = useRenderData((state) => state.isRendererEnabled());
  return (
    <HStack flex={1} justify="center" minW="10rem">
      <IconButton variant="ghost" isDisabled={!isRendererEnabled} icon={<TfiLayoutGrid2Alt />} onClick={() => setGridColumns(gridColumns - 1)} />
      <Slider isDisabled={!isRendererEnabled} value={gridColumns} min={1} max={MAX_GRID_COLUMNS} step={1} w="50%" onChange={value => setGridColumns(value)}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <IconButton variant="ghost" isDisabled={!isRendererEnabled} icon={<TfiLayoutGrid4Alt />} onClick={() => setGridColumns(gridColumns + 1)} />
    </HStack>
  )
}
