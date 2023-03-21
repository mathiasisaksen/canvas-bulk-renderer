
import AddParameterModal from '@/components/Sidebar/AddParameterModal';
import Parameter from '@/components/Sidebar/Parameter';
import { Button, Code, Divider, Flex, Modal, ModalContent, ModalOverlay, Text, useClipboard, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { PlusSquareIcon, CopyIcon, CheckIcon } from '@chakra-ui/icons';
import { useGlobalState } from '@/context/GlobalProvider';

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
  const [parameters, setParameters] = useGlobalState("parameterPanelData", []);
  const { onCopy, hasCopied } = useClipboard(`const parameters = JSON.parse(decodeURIComponent(new URLSearchParams(window.location.search).get("parameters")))`);

  useEffect(() => setParameters(defaultParams), []);

  function updateParameter(value, index) {
    setParameters(parameters.map((v, i) => i === index ? value : v));
  }

  function addParameter(param) {
    setParameters([...parameters, { ...param, active: true }]);
  }

  function removeParameter(index) {
    setParameters(parameters.filter((_, i) => i !== index));
  }

  return (
    <>
    <VStack gap={4} flex={1} h="100%">
      <Button leftIcon={<PlusSquareIcon />} w="100%" onClick={() => setShowAddModal(true)}>Add parameter</Button>
      <VStack flex={1} w="100%" gap={1} divider={<Divider />} overflowY="scroll" sx={{ "::-webkit-scrollbar": { display: "none" } }}>
        {parameters.map((p, i) => <Parameter key={p.name} parameter={p} updateParameter={value => updateParameter(value, i)}removeParameter={() => removeParameter(i)}></Parameter>)}
      </VStack>
      <VStack>
        <Text mt="5" w="100%" textAlign="center" fontSize="sm">(The parameters are passed in the URL query parameter <Code>parameters</Code>.)</Text>
        <Button colorScheme={hasCopied ? "teal" : "gray"} leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />} size="sm" onClick={onCopy}>Copy code for parsing parameters</Button>
      </VStack>
    </VStack>
    
    <AddParameterModal isOpen={showAddModal} hideModal={() => setShowAddModal(false)} addParameter={addParameter} />
    </>
  )
}
