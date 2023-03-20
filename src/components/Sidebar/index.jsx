
import React, { useState } from 'react'
import { RepeatIcon, CloseIcon, MoonIcon, SunIcon, HamburgerIcon, StarIcon } from "@chakra-ui/icons";
import { Box, Button, Collapse, Fade, Flex, IconButton, MenuButton, Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode, VStack } from '@chakra-ui/react';
import ConfigPanel from '@/components/Sidebar/ConfigPanel';
import ParameterPanel from '@/components/Sidebar/ParameterPanel';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();

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
            <Tab>Config</Tab>
            <Tab>Parameters</Tab>
            <Tab>Display</Tab>
          </TabList>
          <TabPanels h="50vh" minH="500px">
            <TabPanel px="0">
              <ConfigPanel />
            </TabPanel>
            <TabPanel px="0" h="100%">
              <ParameterPanel />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Button colorScheme="teal" w="100%" mt="5" leftIcon={<StarIcon />}>Render</Button>
      </VStack>}
    </VStack>
  )
}
