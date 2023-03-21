import RenderBox from '@/components/RenderDisplay/RenderBox'
import { defaultConfig } from '@/consts/defaults';
import useConfig from '@/store/config-store';
import useUI from '@/store/ui-store';
import usePageNumber from '@/store/use-page-number';
import range from '@/utils/range';
import { Flex, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

export default function RenderWindow() {
  const boxShadowColor = useColorModeValue("#00000033", "#ffffff11");
  const renderEnabled = useUI((state) => state.renderEnabled);
  const pageNumber = usePageNumber((state) => state.pageNumber);
  const rendersPerPage = useConfig((state) => state.config.rendersPerPage) ?? defaultConfig.rendersPerPage;

  const lowerSeed = (pageNumber - 1)*rendersPerPage;
  const upperSeed = lowerSeed + rendersPerPage - 1;
  
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
      <Flex w="100%" h="auto" wrap="wrap" justify="flex-start">
        {renderEnabled && range(lowerSeed, upperSeed).map(seed => <RenderBox key={seed} seed={seed} />)}
      </Flex>
    </Flex>
  )
}
