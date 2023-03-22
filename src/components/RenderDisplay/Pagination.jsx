import { Flex, HStack, IconButton, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import usePageNumber from '@/store/use-page-number'
import useUI from '@/store/ui-store'
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import useConfig from '@/store/config-store'
import useRenderData from '@/store/render-data-store';
import api from '@/services/api';

export default function Pagination() {
  const [pageNumber, set, increment, decrement] = usePageNumber((state) => [state.pageNumber, state.set, state.increment, state.decrement]);
  const [internalPage, setInternalPage] = useState(pageNumber);
  const renderEnabled = useUI((state) => state.renderEnabled);
  const { renderMode, batchSize, rendersPerPage, startSeed, prerenderPages } = useConfig((state) => state.getConfig());
  const setIsRendererIdle = useRenderData((state) => state.setIsRendererIdle);
  const inputWidth = Math.max(4, internalPage.toString().length + 2);

  let disableLeft = !renderEnabled, disableRight = !renderEnabled;
  let maxPageBatch = Math.ceil(batchSize/rendersPerPage);
  
  if (renderMode === "prerender") {
    disableLeft ||= internalPage === 1;
    disableRight ||= internalPage === maxPageBatch;
  }

  useEffect(() => {
    setInternalPage(pageNumber);
    if (renderMode !== "continuous" || !renderEnabled) return;
    
    api.post("/api/render/range", { range: [startSeed + (pageNumber - 1)*rendersPerPage, startSeed + (pageNumber + prerenderPages)*rendersPerPage - 1] }).then(() => setIsRendererIdle(false));

  }, [pageNumber]);

  async function updatePage(value) {
    value = parseInt(value);
    if (renderMode === "continuous" || (value > 0 && value <= maxPageBatch)) {
      set(internalPage)
    } else {
      setInternalPage(pageNumber);
    }
  }

  function handleKeyUp(e) {
    if (e.key === "Enter") set(internalPage);
  }

  return (
    <HStack h="5rem">
      <IconButton variant="outline" isDisabled={disableLeft} icon={<IoMdArrowDropleft />} onClick={decrement}  />
      <Input isDisabled={!renderEnabled} w={`${inputWidth}ch`} type="number" textAlign="center" p={0} value={internalPage} onChange={e => setInternalPage(parseInt(e.target.value))} onBlur={() => updatePage(internalPage)} onKeyUp={handleKeyUp} />
      <IconButton variant="outline" isDisabled={disableRight} icon={<IoMdArrowDropright />} onClick={increment} />
    </HStack>
  )
}
