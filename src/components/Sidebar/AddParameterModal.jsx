
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, VStack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

const defaultValues = {
  string: "",
  number: 0,
  boolean: true,
  range: [0, 1],
  array: []
}

export default function AddParameterModal({ isOpen, hideModal, addParameter }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("string");
  const initialRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  function handleAdd() {
    if (name === "") { // TODO Check if name is already in use
      setHasError(true);
      return;
    }
    addParameter({ name, type, value: defaultValues[type] });
    setName();
    setType("string");
    hideModal();
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleAdd();
    }
  }

  return (
    <Modal size="xl" isOpen={isOpen} onClose={hideModal} initialFocusRef={initialRef}>
      <ModalOverlay></ModalOverlay>
      <ModalContent>
        <ModalHeader>Add parameter</ModalHeader>
        <ModalCloseButton />
        <ModalBody onKeyDown={handleKeyPress}>
          <VStack>
            <FormControl isInvalid={hasError}>
              <FormLabel ref={initialRef}>Name</FormLabel>
              <Input value={name} onChange={e => (setName(e.target.value), setHasError(false))}></Input>
              {hasError ? <FormErrorMessage>Name is required</FormErrorMessage> : null}
            </FormControl>
            <FormControl>
              <FormLabel>Parameter type</FormLabel>
              <RadioGroup defaultValue="string">
                <HStack spacing={3}>
                  {["String", "Number", "Boolean", "Range", "Array"].map(name => <Radio key={name} value={name.toLowerCase()} onChange={() => setType(name.toLowerCase())}>{name}</Radio>)}
                </HStack>
              </RadioGroup>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleAdd}>Add</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
