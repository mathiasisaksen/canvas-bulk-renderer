import { Button, Flex, Input, Text, VStack } from '@chakra-ui/react'
import React from 'react'

export default function ConfigPanel() {
  return (
    <Flex direction="column">
      <VStack p="0" w="100%" align="flex-start">
        <Text>Server URL</Text>
        <Input w="100%" placeholder='http://localhost:8080'></Input>
        <Text>Renders per page</Text>
        <Input w="100%" placeholder='20'></Input>
        <Text>Thumbnail resolution</Text>
        <Input w="100%" placeholder='450'></Input>
      </VStack>
    </Flex>
  )
}
