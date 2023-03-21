import { Flex, HStack, IconButton, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import usePageNumber from '@/store/use-page-number'
import useUI from '@/store/ui-store'
import { MdArrowLeft, MdArrowRight } from 'react-icons/md'
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';

export default function Pagination() {
  const [pageNumber, set, increment, decrement] = usePageNumber((state) => [state.pageNumber, state.set, state.increment, state.decrement]);
  const [internalPage, setInternalPage] = useState(pageNumber);
  const renderEnabled = useUI((state) => state.renderEnabled);
  
  const inputWidth = Math.max(4, internalPage.toString().length + 2);

  useEffect(() => {
    setInternalPage(pageNumber);
  }, [pageNumber]);

  

  function handleKeyUp(e) {
    if (e.key === "Enter") set(internalPage);
  }

  return (
    <HStack h="5rem">
      <IconButton variant="outline" isDisabled={!renderEnabled} icon={<IoMdArrowDropleft />} onClick={decrement}  />
      <Input isDisabled={!renderEnabled} w={`${inputWidth}ch`} type="number" textAlign="center" p={0} value={internalPage} onChange={e => setInternalPage(parseInt(e.target.value))} onBlur={() => set(internalPage)} onKeyUp={handleKeyUp} />
      <IconButton variant="outline" isDisabled={!renderEnabled} icon={<IoMdArrowDropright />} onClick={increment} />
    </HStack>
  )
}
