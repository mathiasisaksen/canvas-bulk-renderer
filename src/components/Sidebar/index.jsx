
import React, { useState } from 'react'
import { RepeatIcon, CloseIcon, MoonIcon, SunIcon, HamburgerIcon, StarIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, Fade, Flex, IconButton, MenuButton, Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode, useToast, VStack } from '@chakra-ui/react';
import ConfigPanel from '@/components/Sidebar/ConfigPanel';
import ParameterPanel from '@/components/Sidebar/ParameterPanel';
import { useGlobalState } from '@/context/GlobalProvider';
import useConfigData from '@/context/use-config-data';
import useParameterPanelData from '@/context/use-parameter-panel-data';
import api from '@/services/api';

export default function Sidebar() {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();
  const [renderEnabled, setRenderEnabled] = useGlobalState("renderEnabled", false);
  const [renderIsInitializing, setRenderIsInitializing] = useState(false);
  const [pageNumber, setPageNumber] = useGlobalState("pageNumber", 1);
  console.log('pageNumber: ', pageNumber);
  
  const configData = useConfigData();
  const parameterPanelData = useParameterPanelData();

  async function handleStartRender() {
    try {
      setRenderIsInitializing(true);
      await api.post("/api/render/initialize", { configData, parameterPanelData });

      setRenderEnabled(true);
    } catch (error) {
      const title = error?.response?.data?.error ?? "Error when initializing render engine";
      toast({ title, status: "error" })
    } finally {
      setRenderIsInitializing(false);
      
    }
  }

  function handleStopRender() {
    setRenderEnabled(false);
    setPageNumber(s => s + 1);
  }

  return (
    <VStack px="4" pt="10" overflow="hidden" maxH="100vh">
        <Flex w="100%" justify="space-between">
          <IconButton variant={!isOpen ? "outline" : "solid"} colorScheme="teal" icon={<HamburgerIcon />} onClick={_ => setIsOpen(s => !s)} />
          {isOpen && <IconButton icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />} onClick={toggleColorMode} />}
        </Flex>

      {isOpen && 
      <VStack flex={1} w="26rem" h="auto">
        <Tabs w="100%" isFitted>
          <TabList>
            <Tab>Configuration</Tab>
            <Tab>Parameters</Tab>
            <Tab>Display</Tab>
          </TabList>
          <TabPanels h="50vh" minH="500px">
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
