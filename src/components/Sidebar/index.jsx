
import React, { useState } from 'react'
import { RepeatIcon, CloseIcon, MoonIcon, SunIcon, HamburgerIcon, StarIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, Fade, Flex, HStack, IconButton, MenuButton, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip, useColorMode, useToast, VStack } from '@chakra-ui/react';
import ConfigPanel from '@/components/Sidebar/ConfigPanel';
import ParameterPanel from '@/components/Sidebar/ParameterPanel';
import api from '@/services/api';
import useConfig from '@/store/config-store';
import useParameterPanel from '@/store/parameter-panel-store';
import usePageNumber from '@/store/use-page-number';
import useUI from '@/store/ui-store';

export default function Sidebar() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();
  const [renderEnabled, enableRender, disableRender] = useUI((state) => [state.renderEnabled, state.enableRender, state.disableRender]);
  const [renderIsInitializing, setRenderIsInitializing] = useState(false);
  const setPageNumber = usePageNumber((state) => state.set);
  //const pageNumber = usePageNumber((state) => state.);
  
  const configData = useConfig((state) => state.config);
  const parameterPanelData = useParameterPanel((state) => state.getProcessedPanelObject());

  async function handleStartRender() {
    try {
      setRenderIsInitializing(true);
      await api.post("/api/render/initialize", { configData, parameterPanelData });
      enableRender();
    } catch (error) {
      const title = error.response?.data?.error ?? "Error when initializing render engine";
      toast({ title, status: "error" })
    } finally {
      setRenderIsInitializing(false);
      
    }
  }

  function handleStopRender() {
    disableRender();
    setPageNumber(1);
  }

  return (
    <VStack px="4" pt="10" overflow="hidden" maxH="100vh">
        <Flex w="100%" justify="space-between">
          <IconButton variant={!isOpen ? "outline" : "solid"} colorScheme="teal" icon={<HamburgerIcon />} onClick={_ => setIsOpen(s => !s)} />
          {isOpen && 
            <IconButton icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />} onClick={toggleColorMode} />
          }
        </Flex>

      {isOpen && 
      <VStack flex={1} w="26rem" h="auto">
        <Tabs w="100%" isFitted>
          <TabList>
            <Tab>Configuration</Tab>
            <Tab>Parameters</Tab>
            <Tab>Display</Tab>
          </TabList>
          <TabPanels h="60vh" minH="500px">
            <TabPanel px="0" h="100%">
              <ConfigPanel />
            </TabPanel>
            <TabPanel px="0" h="100%">
              <ParameterPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Button isLoading={renderIsInitializing} colorScheme={renderEnabled ? "pink" : "teal"} w="100%" mt="5" leftIcon={renderEnabled ? <CloseIcon /> : <StarIcon />} onClick={renderEnabled ? handleStopRender : handleStartRender}>{renderEnabled ? "Stop" : "Render"}</Button>
      </VStack>}
    </VStack>
  )
}
