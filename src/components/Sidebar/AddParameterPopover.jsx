
import useParameterPanel from '@/store/parameter-panel-store';
import hasValue from '@/utils/has-value';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverTrigger, Radio, RadioGroup, useDisclosure, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';

const defaultValues = {
  string: "",
  number: 0,
  boolean: true,
  range: [0, 1],
  array: []
}

export default function AddParameterPopover() {
  const [add, isNameAvailable] = useParameterPanel((state) => [state.add, state.isNameAvailable]);
  const [name, setName] = useState("");
  const [type, setType] = useState("string");
  const initialRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isOpen, onClose, onToggle, } = useDisclosure();

  function handleAdd() {
    if (!hasValue(name)) { // TODO Check if name is already in use
      setHasError(true);
      setErrorMessage("Name is required");
      return;
    } else if (!isNameAvailable(name)) {
      setHasError(true);
      setErrorMessage("Name already in use");
      return;
    }
    add({ name, type, value: defaultValues[type] });
    setName("");
    setType("string");
    onClose();
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleAdd();
    }
  }

  return (
    <Popover isOpen={isOpen} placement="bottom-end" onClose={onClose} initialFocusRef={initialRef}>
      <PopoverTrigger>
        <Button leftIcon={<PlusSquareIcon />} onClick={onToggle} flex={1}>Add parameter</Button>
      </PopoverTrigger>
      <PopoverContent  w="100%">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody p="4" w="100%">
          <VStack pb="3">
            <FormControl isInvalid={hasError}>
              <FormLabel ref={initialRef}>Name</FormLabel>
              <Input value={name} onChange={e => (setName(e.target.value), setHasError(false))} onKeyUp={handleKeyPress}></Input>
              {hasError ? <FormErrorMessage>{errorMessage}</FormErrorMessage> : null}
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <RadioGroup defaultValue="string">
                <HStack spacing={3}>
                  {["String", "Number", "Boolean", "Range", "Array"].map(name => <Radio key={name} value={name.toLowerCase()} onChange={() => setType(name.toLowerCase())}>{name}</Radio>)}
                </HStack>
              </RadioGroup>
            </FormControl>
          </VStack>
          <Button w="100%" colorScheme="teal" onClick={handleAdd}>Add</Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
