import { Flex, HStack, IconButton, Input } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { useGlobalState } from '@/context/GlobalProvider'

export default function Pagination() {
  const [globalPage, setGlobalPage] = useGlobalState("pageNumber", 1);
  console.log('globalPage: ', globalPage);
  const [page, setPage] = useState(globalPage);
  
  const width = Math.max(4, page.toString().length + 2);

  function updateGlobal(value) {
    setGlobalPage(value);
    setPage(value);
  }

  function handleKeyUp(e) {
    if (e.key === "Enter") updateGlobal(page);
  }

  return (
    <HStack h="5rem">
      <IconButton icon={<ArrowBackIcon />} onClick={() => updateGlobal(s => s - 1)}  />
      <Input w={`${width}ch`} type="number" textAlign="center" p={0} value={page} onChange={e => setPage(parseInt(e.target.value))} onBlur={() => updateGlobal(page)} onKeyUp={handleKeyUp} />
      <IconButton icon={<ArrowForwardIcon />} onClick={() => updateGlobal(s => s + 1)} />
    </HStack>
  )
}
