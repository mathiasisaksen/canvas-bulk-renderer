import ExplainedLabel from '@/components/ExplainedLabel'
import defaults from '@/consts/defaults'
import { useGlobalState, useSetGlobalValue } from '@/context/GlobalProvider'
import { Button, Code, Flex, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'

let FixedInput = (props) => <Input variant="filled" {...props} />

export default function ConfigPanel() {
  const [url, setUrl] = useGlobalState("url", "");
  const [rendersPerPage, setRendersPerPage] = useGlobalState("rendersPerPage", "");
  const [thumbRes, setThumbRes] = useGlobalState("thumbRes", "");
  const [canvasSelector, setCanvasSelector] = useGlobalState("canvasSelector", "");

  return (
    <Flex direction="column">
      <VStack p="0" w="100%" align="flex-start">
        <FormControl>
          <ExplainedLabel label="The URL of the server that serves your project (typically a dev/live server)">Server URL</ExplainedLabel>
          <FixedInput placeholder={defaults.url} value={url} onChange={e => setUrl(e.target.value)}></FixedInput>
        </FormControl>
        <FormControl>
          <FormLabel>Renders per page</FormLabel>
          <FixedInput type="number" placeholder={defaults.rendersPerPage} value={rendersPerPage} onChange={e => setRendersPerPage(e.target.value)}></FixedInput>
        </FormControl>
        <FormControl>
          <FormLabel>Thumbnail resolution</FormLabel>
          <FixedInput type="number" placeholder={defaults.thumbRes} value={thumbRes} onChange={e => setThumbRes(e.target.value)}></FixedInput>
        </FormControl>
        <FormControl>
          <ExplainedLabel label="Selector for the canvas that the final image is rendered onto">Canvas CSS selector</ExplainedLabel>
          <FixedInput placeholder={defaults.canvasSelector} value={canvasSelector} onChange={e => setCanvasSelector(e.target.value)}></FixedInput>
        </FormControl>
      </VStack>
      <Text mt="5" w="100%" textAlign="center" fontSize="sm">(If empty, placeholder values will be used)</Text>
      <Text mt="5" w="100%" textAlign="center" fontSize="sm">Remember to set <Code>document.complete = true</Code> when the render is finished</Text>
    </Flex>
  )
}
