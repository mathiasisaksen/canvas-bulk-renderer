import { Flex, HStack, IconButton, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { useGlobalState } from '@/context/GlobalProvider'

export default function Pagination() {
  const [pageNumber, setPageNumber] = useGlobalState("pageNumber", 1);
  const [internalPage, setInternalPage] = useState(pageNumber);
  const [renderEnabled] = useGlobalState("renderEnabled", false);
  const [prerenderPages] = useGlobalState("prerenderPages", 1);
  const [rendersPerPage] = useGlobalState("rendersPerPage", 20);
  
  useEffect(() => {
    setInternalPage(pageNumber);
  }, [pageNumber]);

  const width = Math.max(4, internalPage.toString().length + 2);

  async function updateGlobal(value) {
    setPageNumber(value);
    setInternalPage(value);
  }

  function handleKeyUp(e) {
    if (e.key === "Enter") updateGlobal(internalPage);
  }

  return (
    <HStack h="5rem">
      <IconButton isDisabled={!renderEnabled} icon={<ArrowBackIcon />} onClick={() => updateGlobal(pageNumber - 1)}  />
      <Input isDisabled={!renderEnabled} w={`${width}ch`} type="number" textAlign="center" p={0} value={internalPage} onChange={e => setInternalPage(parseInt(e.target.value))} onBlur={() => updateGlobal(internalPage)} onKeyUp={handleKeyUp} />
      <IconButton isDisabled={!renderEnabled} icon={<ArrowForwardIcon />} onClick={() => updateGlobal(pageNumber + 1)} />
    </HStack>
  )
}
