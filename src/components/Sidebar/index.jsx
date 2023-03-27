
import { useState } from 'react';
import { MoonIcon, SunIcon, QuestionIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, HStack, Icon, IconButton, Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode, useColorModeValue, VStack } from '@chakra-ui/react';
import ConfigPanel from '@/components/Sidebar/ConfigPanel';
import ParameterPanel from '@/components/Sidebar/ParameterPanel';
import useConfig from '@/store/config-store';
import useUI from '@/store/ui-store';
import RendererProgress from '@/components/Sidebar/RendererProgress';
import useRenderData from '@/store/render-data-store';
import MenuButton from '@/components/Sidebar/MenuButton';
import HelpModal from '@/components/Sidebar/HelpModal';
import SubmitButton from '@/components/Sidebar/SubmitButton';
import FilterPanel from '@/components/Sidebar/FilterPanel';
import { TfiLayoutGrid2Alt } from 'react-icons/tfi'
import { BsFillGridFill } from 'react-icons/bs';

export default function Sidebar() {
  const menuIsOpen = useUI((state) => state.menuIsOpen);
  const [helpIsOpen, setHelpIsOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  let bg = useColorModeValue("#fafafa", "#0f1216ee");

  if (!menuIsOpen) bg = "transparent";

  const isRendererEnabled = useRenderData((state) => state.isRendererEnabled());

  const configData = useConfig((state) => state.getConfig());

  return (
    <>
      {!menuIsOpen ? null :
        <VStack h="100%" w={{ base: "100%", md: "auto" }} px="4" pt="3" maxH="100vh" position={{ base: "absolute", md: "relative" }} right={0} left={0} bottom={0} top={0} zIndex={menuIsOpen ? 100 : 0}>
          <Flex w="100%" maxW="26rem" h="100%" direction="column">
            <Flex w="100%" justify="space-between" align="center" mb="2">
              <Flex align="center" flex={1}>
                <Icon boxSize="3rem" as={BsFillGridFill} />
                <Box gap="0px" ml="1">
                  <Heading size="md">CANVAS BULK</Heading>
                  <Heading size="md">RENDERER</Heading>
                </Box>
              </Flex>
              <HStack>
                <MenuButton />
                <IconButton variant="ghost" icon={<QuestionIcon />} onClick={() => setHelpIsOpen(s => !s)} />
                <IconButton variant="ghost" icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />} onClick={toggleColorMode} />
              </HStack>
            </Flex>

            <Flex w="100%" flex={1} h="100%" direction="column">
              <Tabs w="100%" isFitted h="100%" flex={1} display="flex" flexDirection="column">
                <TabList>
                  <Tab>Configuration</Tab>
                  <Tab>Parameters</Tab>
                  <Tab>Filter</Tab>
                </TabList>
                <TabPanels px="0"  maxH="100%">
                  <TabPanel px="0" h="100%">
                    <ConfigPanel />
                  </TabPanel>
                  <TabPanel px="0" h="100%">
                    <ParameterPanel />
                  </TabPanel>
                  <TabPanel px="0" h="100%">
                    <FilterPanel />
                  </TabPanel>
                </TabPanels>
              </Tabs>
              <SubmitButton />
              {false && isRendererEnabled && configData.renderMode === "prerender" ? <RendererProgress /> : null}
            </Flex>
          </Flex>

        </VStack>}
      <HelpModal isOpen={helpIsOpen} hideModal={() => setHelpIsOpen(false)} />
    </>
  )
}
