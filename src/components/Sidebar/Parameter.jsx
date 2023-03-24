import { Box, Button, ButtonGroup, Checkbox, Flex, FormControl, FormLabel, HStack, IconButton, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Tag, TagCloseButton, TagLabel, TagRightIcon, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import { SmallCloseIcon, ViewIcon, ViewOffIcon, AddIcon, CheckIcon } from '@chakra-ui/icons';
import hasValue from '@/utils/has-value';
import useRenderData from '@/store/render-data-store';
import { FaRegCircle, FaCircle } from 'react-icons/fa'

export default function Parameter({ parameter, updateParameter, removeParameter }) {
  const isRendererEnabled = useRenderData((state) => state.isRendererEnabled());
  const gray = useColorModeValue("gray.800", "gray.200");
  const { name, type, value, active } = parameter;

  function updateValue(newValue) {
    updateParameter({ ...parameter, value: newValue });
  }

  function toggleActive() {
    updateParameter({ ...parameter, active: !active });
  }

  let inputElements;

  if (type === "string") {
    inputElements = <Input isDisabled={isRendererEnabled} variant="filled" placeholder='Value' value={value} onChange={e => updateValue(Number(e.target.value))} />
  } else if (type === "number") {
    inputElements = <NumberInput isDisabled={isRendererEnabled} variant="filled" value={value} onChange={updateValue}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  } else if (type === "boolean") {
    inputElements = <ButtonGroup isDisabled={isRendererEnabled} isAttached flex={1}>
      <Button variant={value ? "solid" : "outline"} flex={1} colorScheme={value ? "teal" : "gray"} onClick={() => updateValue(true)}>True</Button>
      <Button variant={!value ? "solid" : "outline"} flex={1} colorScheme={!value ? "pink" : "gray"} onClick={() => updateValue(false)}>False</Button>
    </ButtonGroup>
  } else if (type === "range") {
    inputElements = <HStack>
      <Input isDisabled={isRendererEnabled} variant="filled" placeholder='lower' value={value[0]} onChange={(e) => updateValue([parseFloat(e.target.value), value[1]])} />
      <Text>–</Text>
      <Input isDisabled={isRendererEnabled} variant="filled" placeholder='upper' value={value[1]} onChange={(e) => updateValue([value[0], Number(e.target.value)])} />
    </HStack>
  } else if (type === "array") {
    inputElements = <ArrayInputField />
  }

  return (
    <HStack w="100%" opacity={active ? 1 : 0.5}>
      <Text mr={2} as="b">{name}</Text>
      <Flex flex={1} justify="flex-end">{inputElements}</Flex>
      <Tooltip label={active ? "Disable" : "Enable"}>
        <IconButton isDisabled={isRendererEnabled} variant="ghost" icon={active ? <FaCircle /> : <FaRegCircle />} onClick={toggleActive} />
      </Tooltip>
      <Tooltip label="Remove">
        <IconButton isDisabled={isRendererEnabled} variant="ghost" icon={<SmallCloseIcon />} onClick={removeParameter} />
      </Tooltip>
    </HStack>
  )

  function ArrayInputField() {
    const [newElement, setNewElement] = useState();
    const [isAdding, setIsAdding] = useState(false);

    function handleNewKeyDown(e) {
      if (e.key === "Enter") addNewElement();    
    }

    function addNewElement() {
      if (hasValue(newElement)) updateValue([...value, { elementValue: newElement, active: true }]);
      setIsAdding(false);
    }

    function toggleElementActive(ind) {
      updateValue(value.map((v, j) => ind === j ? { ...v, active: !v.active } : v));
    }

    return (
      <Flex opacity={isRendererEnabled ? 0.5 : 1} flex={1} direction="row" wrap="wrap" gap={2} justify={value.length > 0 ? "flex-start" : "flex-end"}>
        {value.map(({ elementValue, active }, i) =>
          <Tag size="lg" opacity={active ? 1 : 0.5} key={elementValue}>
            <Button variant="unstyled" isDisabled={isRendererEnabled} onClick={() => toggleElementActive(i)}>
            <TagLabel>{elementValue}</TagLabel>
            </Button>
            <TagCloseButton isDisabled={isRendererEnabled} cursor={isRendererEnabled ? "not-allowed" : "pointer"} onClick={() => updateValue(value.filter((_, j) => i !== j))} />
          </Tag>
        )
        }
        {isAdding ?
          <Tag>
            <Input autoFocus size="sm" variant="filled" onChange={e => setNewElement(e.target.value)} onKeyDown={handleNewKeyDown} />
            <TagRightIcon cursor="pointer" opacity="0.5" color={gray} as={CheckIcon} _hover={{ opacity: 1 }} onClick={addNewElement} />
            <TagCloseButton onClick={() => setIsAdding(false)} />
          </Tag> :
          <IconButton isDisabled={isRendererEnabled} size="sm" variant="ghost" icon={<AddIcon />} onClick={() => setIsAdding(true)} />}

      </Flex>

    )
  }
}

