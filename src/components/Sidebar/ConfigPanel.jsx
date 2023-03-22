import ExplainedLabel from '@/components/ExplainedLabel'
import { defaultConfig } from '@/consts/defaults'
import useConfig from '@/store/config-store'
import { Button, ButtonGroup, Code, Container, Divider, Flex, FormControl, FormLabel, IconButton, Input, Text, Tooltip, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { DeleteIcon, deleteIcon } from '@chakra-ui/icons';
import parseInteger from '@/utils/parse-integer'

const FixedInput = (props) => <Input variant="filled" {...props} />

export default function ConfigPanel() {
  const [isPrerender, setIsPrerender] = useState(true);
  const { url, rendersPerPage, thumbRes, canvasSelector, numRenderInstances, prerenderPages, batchSize, renderMode, startSeed } = useConfig((state) => state.config);
  const [setConfigValue, clearConfig] = useConfig((state) => [state.setConfigValue, state.clear]);

  // Fixes hydration issue
  useEffect(() => setIsPrerender(renderMode === "prerender"), [renderMode]);

  return (
    <Flex direction="column" flex={1} h="100%">
      <VStack p="0" w="100%" align="flex-start" flex={1} position="relative" overflowY="scroll" sx={{ "::-webkit-scrollbar": { display: "none" } }}>
        <Tooltip label="Clear configuration">
          <IconButton size="sm" variant="ghost" icon={<DeleteIcon />} position="absolute" right={0} zIndex={99} onClick={clearConfig} />
        </Tooltip>
        <FormControl>
          <ExplainedLabel label="The URL of the server that serves your project (typically a dev/live server)">Server URL</ExplainedLabel>
          <FixedInput placeholder={defaultConfig.url} value={url ?? ""} onChange={e => setConfigValue("url", e.target.value)}></FixedInput>
        </FormControl>
        <FormControl>
          <FormLabel>Renders per page</FormLabel>
          <FixedInput type="number" placeholder={defaultConfig.rendersPerPage} value={rendersPerPage ?? ""} onChange={e => setConfigValue("rendersPerPage", parseInteger(e.target.value))}></FixedInput>
        </FormControl>
        <FormControl>
          <FormLabel>Thumbnail resolution</FormLabel>
          <FixedInput type="number" placeholder={defaultConfig.thumbRes} value={thumbRes ?? ""} onChange={e => setConfigValue("thumbRes", parseInteger(e.target.value))}></FixedInput>
        </FormControl>
        <FormControl>
          <ExplainedLabel label="Selector for the canvas that the desired image is rendered onto">Canvas CSS selector</ExplainedLabel>
          <FixedInput placeholder={defaultConfig.canvasSelector} value={canvasSelector ?? ""} onChange={e => setConfigValue("canvasSelector", e.target.value)}></FixedInput>
        </FormControl>
        <FormControl>
          <ExplainedLabel label="Number of headless browser instances to use when rendering thumbnails">Render instances</ExplainedLabel>
          <FixedInput type="number" placeholder={defaultConfig.numRenderInstances} value={numRenderInstances ?? ""} onChange={e => setConfigValue("numRendersInstances", parseInteger(e.target.value))}></FixedInput>
        </FormControl>
        <FormControl>
          <ExplainedLabel label="The first seed used, followed by seed + 1, seed + 2,...">Start seed</ExplainedLabel>
          <FixedInput type="number" placeholder={defaultConfig.startSeed} value={startSeed ?? ""} onChange={e => setConfigValue("startSeed", parseInteger(e.target.value))}></FixedInput>
      </FormControl>
        <FormControl pt="4">
          <ExplainedLabel mt="4" label="Should the renders be generated continuously page-per-page, or in a single batch?">Mode</ExplainedLabel>
          <ButtonGroup isAttached flex={1} w="100%">
          <Button variant={isPrerender ? "solid" : "outline"} colorScheme={isPrerender ? "teal" : "gray"} flex={1} onClick={() => setConfigValue("renderMode", "prerender")}>Prerender</Button>
            <Button variant={!isPrerender ? "solid" : "outline"} colorScheme={!isPrerender ? "teal" : "gray"} flex={1} onClick={() => setConfigValue("renderMode", "continuous")}>Continuous</Button>
          </ButtonGroup>
        </FormControl>
        {isPrerender ? 
        <FormControl>
          <FormLabel>Batch size</FormLabel>
          <FixedInput type="number" placeholder={defaultConfig.batchSize} value={batchSize ?? ""} onChange={e => setConfigValue("batchSize", parseInteger(e.target.value))}></FixedInput>
      </FormControl>
        :
        
        <FormControl>
          <ExplainedLabel label="Number of pages to render in advance">Number of pages to render ahead</ExplainedLabel>
          <FixedInput type="number" placeholder={defaultConfig.prerenderPages} value={prerenderPages ?? ""} onChange={e => setConfigValue("prerenderPages", parseInteger(e.target.value))}></FixedInput>
        </FormControl>}
        
      </VStack>
      <VStack>
        <Text mt="5" w="100%" textAlign="center" fontSize="sm">(If empty, placeholder value will be used)</Text>
        <Text mt="5" w="100%" textAlign="center" fontSize="sm">Remember to set <Code>document.complete = true</Code> when the render is finished</Text>
      </VStack>
    </Flex>
  )
}
