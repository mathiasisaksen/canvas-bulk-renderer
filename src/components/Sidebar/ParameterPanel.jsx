
import AddParameterModal from '@/components/Sidebar/AddParameterModal';
import Parameter from '@/components/Sidebar/Parameter';
import { Button, ButtonGroup, Code, Divider, Flex, IconButton, Modal, ModalContent, ModalOverlay, Text, Tooltip, useClipboard, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { PlusSquareIcon, CopyIcon, CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import useParameterPanel from '@/store/parameter-panel-store';

const defaultParams = [
  { name: "Texture", value: "Grit", type: "string", active: true },
  { name: "Warp", value: 0.1, type: "number", active: true },
  { name: "HasBg", value: true, type: "boolean", active: true },
  { name: "Threshold", value: [0.2, 0.6], type: "range", active: true },
  { 
    name: "Palette", 
    value: [
      { elementValue: "Vanilla", active: true },
      { elementValue: "Miscelanea", active: true },
      { elementValue: "Goofy", active: true },
      { elementValue: "Yr Immanence", active: false }
    ], 
    type: "array", 
    active: true 
  },
]

export default function ParameterPanel() {
  const [showAddModal, setShowAddModal] = useState(false);
  // To avoid hydration error
  const [internalParameters, setInternalParameters] = useState([]);
  const [parameters, setAll, add, remove, update, clear] = useParameterPanel((state) => [state.parameterPanel, state.setAll, state.add, state.remove, state.update, state.clear]);

  const { onCopy, hasCopied } = useClipboard(`const parameters = JSON.parse(decodeURIComponent(new URLSearchParams(window.location.search).get("parameters")))`);

  useEffect(() => setInternalParameters(parameters), [parameters]);

  //useEffect(() => setAll(defaultParams), [setAll]);

  return (
    <>
    <VStack gap={4} flex={1} h="100%">
      <ButtonGroup isAttached w="100%" variant="outline">
        <Button leftIcon={<PlusSquareIcon />} flex={1} onClick={() => setShowAddModal(true)}>Add parameter</Button>
        <Tooltip label="Clear parameters">
          <IconButton icon={<DeleteIcon />} onClick={clear} />
        </Tooltip>
      </ButtonGroup>
      <VStack flex={1} w="100%" gap={1} divider={<Divider />} overflowY="scroll" sx={{ "::-webkit-scrollbar": { display: "none" } }}>
        {internalParameters.map((p, i) => <Parameter key={p.name} parameter={p} updateParameter={value => update(i, value)}removeParameter={() => remove(i)}></Parameter>)}
      </VStack>
      <VStack>
        <Text mt="5" w="100%" textAlign="center" fontSize="sm">(The parameters are passed in the URL query parameter <Code>parameters</Code>.)</Text>
        <Button colorScheme={hasCopied ? "teal" : "gray"} leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />} size="sm" onClick={onCopy}>Copy code for parsing parameters</Button>
      </VStack>
    </VStack>
    
    <AddParameterModal isOpen={showAddModal} hideModal={() => setShowAddModal(false)} addParameter={add} />
    </>
  )
}
