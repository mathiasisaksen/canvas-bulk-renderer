
import AddParameterModal from '@/components/Sidebar/AddParameterModal';
import Parameter from '@/components/Sidebar/Parameter';
import { Button, Divider, Flex, Modal, ModalContent, ModalOverlay, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { AddIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { useGlobalState } from '@/context/GlobalProvider';

const defaultParams = [
  //{ name: "Texture", value: "Grit", type: "string", active: true },
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
    </VStack>

    <AddParameterModal isOpen={showAddModal} hideModal={() => setShowAddModal(false)} addParameter={addParameter} />
    </>
  )
}
