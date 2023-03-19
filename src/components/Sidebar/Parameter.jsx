import { Box, Button, ButtonGroup, Checkbox, Flex, HStack, IconButton, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Tag, TagCloseButton, TagLabel, TagRightIcon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { SmallCloseIcon, ViewIcon, ViewOffIcon, AddIcon, CheckIcon } from '@chakra-ui/icons';

export default function Parameter({ parameter, updateParameter, removeParameter }) {

  const { name, type, value, active } = parameter;
  console.log('value: ', value);

  function updateValue(newValue) {
    updateParameter({ ...parameter, value: newValue });
  }

  function toggleActive() {
    updateParameter({ ...parameter, active: !active });
  }

  let inputElements;

  if (type === "string") {
    inputElements = <Input variant="filled" placeholder='Value' value={value} onChange={e => updateValue(e.target.value)} />
  } else if (type === "number") {
    inputElements = <NumberInput variant="filled" value={value} onChange={updateValue}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  } else if (type === "boolean") {
    inputElements = <ButtonGroup isAttached flex={1}>
      <Button flex={1} colorScheme={value ? "teal" : null} onClick={() => updateValue(true)}>True</Button>
      <Button flex={1} colorScheme={!value ? "pink" : null} onClick={() => updateValue(false)}>False</Button>
    </ButtonGroup>
  } else if (type === "range") {
    inputElements = <HStack>
      <Input variant="filled" placeholder='lower' value={value[0]} onChange={(e) => updateValue([e.target.value, value[1]])} />
      <Text>–</Text>
      <Input variant="filled" placeholder='upper' value={value[1]} onChange={(e) => updateValue([value[0], e.target.value])} />
    </HStack>
  } else if (type === "array") {
    inputElements = <ArrayInputField />
  }

  return (
    <HStack w="100%" opacity={active ? 1 : 0.5}>
      <Text mr={2} as="b">{name}</Text>
      <Flex flex={1} justify="flex-end">{inputElements}</Flex>
      <IconButton variant="ghost" icon={active ? <ViewOffIcon /> : <ViewIcon />} isChecked={active} onClick={toggleActive} />
      <IconButton variant="ghost" icon={<SmallCloseIcon />} onClick={removeParameter} />
    </HStack>
  )

  function ArrayInputField() {
    const [newElement, setNewElement] = useState();
    const [isAdding, setIsAdding] = useState(false);

    function handleNewKeyDown(e) {
      if (e.key === "Enter") {
        addNewElement();
      }
    }

    function addNewElement() {
      updateValue([...value, { elementValue: newElement, active: true }]);
      setIsAdding(false);
    }

    function toggleElementActive(ind) {
      updateValue(value.map((v, j) => ind === j ? { ...v, active: !v.active } : v));
    }

    return (
      <Flex flex={1} direction="row" wrap="wrap" gap={2} justify={value.length > 0 ? "flex-start" : "flex-end"}>
          {value.map(({ elementValue, active }, i) => 
            <Tag size="lg" opacity={active ? 1 : 0.5} key={elementValue}>
              <TagLabel userSelect="none" cursor="pointer" onClick={() => toggleElementActive(i)}>{elementValue}</TagLabel>
              <TagCloseButton onClick={() => updateValue(value.filter((_, j) => i !== j))}/>
            </Tag>
          )
        }
       {isAdding ? 
        <Tag>
          <Input autoFocus size="sm" variant="filled" onChange={e => setNewElement(e.target.value)} onKeyDown={handleNewKeyDown}/>
          <TagRightIcon cursor="pointer" opacity="0.5" color="gray.800" as={CheckIcon} _hover={{ opacity: 1 }} onClick={addNewElement}/>
          <TagCloseButton onClick={() => setIsAdding(false)} />
        </Tag> : 
        <IconButton size="sm" variant="ghost" icon={<AddIcon />} onClick={() => setIsAdding(true)} /> }
       
      </Flex>

    )
  }
}

