import { CheckIcon, CopyIcon } from '@chakra-ui/icons';
import { Box, Button, Code, Flex, FormControl, FormErrorMessage, FormLabel, Grid, Heading, HStack, Input, Kbd, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Tab, Table, TableContainer, TabList, TabPanel, TabPanels, Tabs, Tbody, Td, Text, Th, Thead, Tr, useClipboard, VStack } from '@chakra-ui/react'
import React, { useRef } from 'react'

const parseCode = `const renderData = (() => {
  const renderUrlParams = new URLSearchParams(window.location.search);
  return {
    seed: parseInt(renderUrlParams.get("seed")),
    hash: renderUrlParams.get("hash"),
    resolution: parseInt(renderUrlParams.get("resolution")),
    parameters: JSON.parse(decodeURIComponent(renderUrlParams.get("parameters")))
  }
})();`

export default function HelpModal({ isOpen, hideModal }) {
  const { onCopy, hasCopied } = useClipboard(parseCode);

  return (
    <Modal scrollBehavior='inside' size="xl" isOpen={isOpen} onClose={hideModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Help</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="3">
          <VStack w="100%" align="flex-start" gap="5">
            <VStack align="flex-start">
              <Text>
                The bulk renderer works by running your project in multiple headless browser instances, fetching the canvas image data once finished.
                This requires that the project is served from a server, typically a live/development server. In VS Code, for example, the <Link href="https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer" target="_blank" isExternal>Live Server extension</Link> is easy to use.
              </Text>
              <Text>
                Note: the headless browsers relies on you to indicate when the render is finished, by setting <Code>document.complete = true</Code> in your project code.
              </Text>
              <Link pt="3" href="https://github.com/mathiasisaksen/canvas-bulk-renderer" target="_blank">GitHub repo</Link>
            </VStack>

            <Tabs w="100%" isFitted>
              <TabList>
                <Tab>URL parameters</Tab>
                <Tab>Shortcuts</Tab>
              </TabList>
              <TabPanels px="0" maxH="100%">
                <TabPanel px="0" h="100%">
                  <VStack w="100%" gap="3">
                    <Text>The following data is encoded in the URL query string. For easy incorporation into your project, click the button below to copy code that parses the values into an object.</Text>
                    <Button colorScheme={hasCopied ? "teal" : "gray"} leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />} size="sm" onClick={onCopy}>Copy code for parsing parameters</Button>
                    <Grid templateColumns="auto 1fr" rowGap="5" columnGap="8">
                      <Text>seed</Text><Text>An integer seed value, typically used to initialize an RNG.</Text>
                      <Text>hash</Text><Text>A hash generated from <Code>seed</Code>. Useful for projects that derive randomness from a transaction hash.</Text>
                      <Text>resolution</Text><Text>The desired resolution of the render, specified in the {'"'}Thumbnail resolution{'"'} field. Ideally, this can be ignored, as the headless browser instances use a viewport size of <Code>resolution x resolution</Code>. If the size of your canvas does not adapt to the viewport size, however, the renders will not end up with correct resolution.</Text>
                      <Text>parameters</Text><Text>An object containing the name-value pairs from the parameter panel.</Text>
                    </Grid>
                  </VStack>
                </TabPanel>
                <TabPanel px="0" h="100%">
                  <VStack align="flex-start" w="100%">
                    <Flex w="100%" direction="column" align="center">
                      <Grid templateColumns="1fr 1fr" gap="5">
                        <Text><Kbd>ctrl</Kbd> + <Kbd>M</Kbd></Text><Text>Toggle menu</Text>
                        <Text><Kbd>ctrl</Kbd> + <Kbd>J</Kbd></Text><Text>Previous page</Text>
                        <Text><Kbd>ctrl</Kbd> + <Kbd>K</Kbd></Text><Text>Next page</Text>
                        <Text><Kbd>ctrl</Kbd> + <Kbd>-</Kbd></Text><Text>Increase grid columns</Text>
                        <Text><Kbd>ctrl</Kbd> + <Kbd>-</Kbd></Text><Text>Decrease grid columns</Text>
                        <Text><Kbd>ctrl</Kbd> + <Kbd>D</Kbd></Text><Text>Toggle dark/light mode</Text>
                        <Text><Kbd>ctrl</Kbd> + <Kbd>enter</Kbd></Text><Text>Start renderer</Text>
                      </Grid>
                    </Flex>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>



          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
