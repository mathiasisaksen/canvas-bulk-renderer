
import { FormLabel, HStack, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { QuestionIcon } from '@chakra-ui/icons';

export default function ExplainedLabel({ label, children }) {
  return (
    <HStack align="center" mb={2} mr={3}>
      <FormLabel m={0}>{children}</FormLabel>
      <Tooltip label={label} textAlign="center">
        <QuestionIcon />
      </Tooltip>
    </HStack>
  )
}
