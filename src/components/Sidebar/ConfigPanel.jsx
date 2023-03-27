import ExplainedLabel from '@/components/ExplainedLabel'
import { defaultConfig } from '@/consts/defaults'
import useConfig from '@/store/config-store'
import { Box, Button, ButtonGroup, Code, Container, Divider, Flex, FormControl, FormLabel, IconButton, Input, Text, Tooltip, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { DeleteIcon, deleteIcon } from '@chakra-ui/icons';
import parseInteger from '@/utils/parse-integer'
import useRenderData from '@/store/render-data-store'

const FixedInput = (props) => <Input variant="filled" {...props} />

export default function ConfigPanel() {
  const [isPrerender, setIsPrerender] = useState(true);
  const { url, rendersPerPage, thumbRes, canvasSelector, numRenderInstances, prerenderPages, batchSize, renderMode, startSeed } = useConfig((state) => state.config);
  const [setConfigValue, clearConfig] = useConfig((state) => [state.setConfigValue, state.clear]);
  const isRendererEnabled = useRenderData((state) => state.isRendererEnabled());

  // Fixes hydration issue
  useEffect(() => setIsPrerender(renderMode === "prerender"), [renderMode]);

  return (
    <Flex direction="column" flex={1} maxH="100%">
      <Flex flex={1} h="100%" maxH="60lvh" overflowY="scroll" sx={{ "::-webkit-scrollbar": { display: "none" } }}>
        <VStack p="0" w="100%" align="flex-start" flex={1} position="relative">
          <Tooltip label="Clear configuration">
            <IconButton isDisabled={isRendererEnabled} size="sm" variant="ghost" icon={<DeleteIcon />} position="absolute" right={0} zIndex={99} onClick={clearConfig} />
          </Tooltip>
          <FormControl isDisabled={isRendererEnabled}>
            <ExplainedLabel label="The URL of the server that serves your project (typically a dev/live server)">Server URL</ExplainedLabel>
            <FixedInput placeholder={defaultConfig.url} value={url ?? ""} onChange={e => setConfigValue("url", e.target.value)}></FixedInput>
          </FormControl>
          <FormControl>
            <FormLabel>Renders per page</FormLabel>
            <FixedInput type="number" placeholder={defaultConfig.rendersPerPage} value={rendersPerPage ?? ""} onChange={e => setConfigValue("rendersPerPage", parseInteger(e.target.value))}></FixedInput>
          </FormControl>
          <FormControl isDisabled={isRendererEnabled}>
            <FormLabel>Thumbnail resolution</FormLabel>
            <FixedInput type="number" placeholder={defaultConfig.thumbRes} value={thumbRes ?? ""} onChange={e => setConfigValue("thumbRes", parseInteger(e.target.value))}></FixedInput>
          </FormControl>
          <FormControl isDisabled={isRendererEnabled}>
            <ExplainedLabel label="Selector for the canvas that the desired image is rendered onto">Canvas CSS selector</ExplainedLabel>
            <FixedInput placeholder={defaultConfig.canvasSelector} value={canvasSelector ?? ""} onChange={e => setConfigValue("canvasSelector", e.target.value)}></FixedInput>
          </FormControl>
          <FormControl isDisabled={isRendererEnabled}>
            <ExplainedLabel label="Number of headless browser instances to use when rendering thumbnails">Render instances</ExplainedLabel>
            <FixedInput type="number" placeholder={defaultConfig.numRenderInstances} value={numRenderInstances ?? ""} onChange={e => setConfigValue("numRenderInstances", parseInteger(e.target.value))}></FixedInput>
          </FormControl>
          <FormControl isDisabled={isRendererEnabled}>
            <ExplainedLabel label="The first seed used, followed by seed + 1, seed + 2,...">Start seed</ExplainedLabel>
            <FixedInput type="number" placeholder={defaultConfig.startSeed} value={startSeed ?? ""} onChange={e => setConfigValue("startSeed", parseInteger(e.target.value))}></FixedInput>
          </FormControl>
          <FormControl pt="4" isDisabled={isRendererEnabled}>
            <ExplainedLabel mt="4" label="Should the renders be generated in a single batch, or continuously page-per-page?">Mode</ExplainedLabel>
            <ButtonGroup isDisabled={isRendererEnabled} isAttached flex={1} w="100%">
              <Button variant={isPrerender ? "solid" : "outline"} colorScheme={isPrerender ? "teal" : "gray"} flex={1} onClick={() => setConfigValue("renderMode", "prerender")}>Pre-render</Button>
              <Button variant={!isPrerender ? "solid" : "outline"} colorScheme={!isPrerender ? "teal" : "gray"} flex={1} onClick={() => setConfigValue("renderMode", "continuous")}>Continuous</Button>
            </ButtonGroup>
          </FormControl>
          {isPrerender ?
            <FormControl isDisabled={isRendererEnabled}>
              <FormLabel>Batch size</FormLabel>
              <FixedInput type="number" placeholder={defaultConfig.batchSize} value={batchSize ?? ""} onChange={e => setConfigValue("batchSize", parseInteger(e.target.value))}></FixedInput>
            </FormControl>
            :

            <FormControl>
              <ExplainedLabel label="Minimize waiting by rendering upcoming pages in advance">Number of pages to render ahead</ExplainedLabel>
              <FixedInput type="number" placeholder={defaultConfig.prerenderPages} value={prerenderPages ?? ""} onChange={e => setConfigValue("prerenderPages", parseInteger(e.target.value))}></FixedInput>
            </FormControl>}

        </VStack>
      </Flex>
      <VStack>
        <Text mt="5" w="100%" textAlign="center" fontSize="sm">(If left empty, placeholder value will be used)</Text>
        <Text mt="5" w="100%" textAlign="center" fontSize="sm">Remember to indicate that the render is finished by setting <Code>document.complete = true</Code> in your code!</Text>
      </VStack>
    </Flex>
  )
}
