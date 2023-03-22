
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
import RenderProgress from '@/components/Sidebar/RenderProgress';
import useRenderData from '@/store/render-data-store';
import rs from '@/consts/renderer-states';
import { renderRange } from '@/api/renderer';

export default function Sidebar() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();

  const [rendererState, setRendererState, isRendererEnabled] = useRenderData((state) => [state.rendererState, state.setRendererState, state.isRendererEnabled()]);
  const setPageNumber = usePageNumber((state) => state.set);

  let configData = useConfig((state) => state.getConfig());
  const parameterPanelData = useParameterPanel((state) => state.getProcessedPanelObject());

  async function handleStartRender() {
    try {
      
      setRendererState(rs.INITIALIZING);
      await api.post("/api/render/initialize", { configData, parameterPanelData });

      const { renderMode, batchSize, startSeed, prerenderPages, rendersPerPage } = configData;

      setRendererState(rs.RENDERING);
      if (renderMode === "prerender") {
        await renderRange(startSeed, batchSize);
      } else if (renderMode === "continuous") {
        await renderRange(startSeed, rendersPerPage*(1 + prerenderPages));
      } else {
        toast({ title: "Invalid render mode", status: "error" });
      }

    } catch (error) {
      const title = error.response?.data?.error ?? "Error when initializing render engine";
      toast({ title, status: "error" });
      setRendererState(rs.CONFIG);
    }
  }

  function handleStopRender() {
    setRendererState(rs.CONFIG);
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
        <Flex flex={1} w="26rem" h="auto" direction="column">
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
          <Button isLoading={rendererState === rs.INITIALIZING} colorScheme={isRendererEnabled ? "pink" : "teal"} w="100%" mt="2" mb="10" leftIcon={isRendererEnabled ? <CloseIcon /> : <StarIcon />} onClick={isRendererEnabled ? handleStopRender : handleStartRender}>{isRendererEnabled ? "Stop" : "Render"}</Button>
          <RenderProgress />
        </Flex>}
    </VStack>
  )
}
