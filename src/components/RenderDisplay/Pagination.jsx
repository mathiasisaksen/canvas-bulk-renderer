import { Flex, HStack, IconButton, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import usePageNumber from '@/store/use-page-number'
import useUI from '@/store/ui-store'
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import useConfig from '@/store/config-store'
import useRenderData from '@/store/render-data-store';
import api from '@/services/api';
import rs from '@/consts/renderer-states';

export default function Pagination() {
  const [pageNumber, set, increment, decrement] = usePageNumber((state) => [state.pageNumber, state.set, state.increment, state.decrement]);
  const [internalPage, setInternalPage] = useState(pageNumber);
  const [isRendererEnabled, setRendererState] = useRenderData((state) => [state.isRendererEnabled(), state.setRendererState]);
  const { renderMode, batchSize, rendersPerPage, startSeed, prerenderPages } = useConfig((state) => state.getConfig());

  const inputWidth = Math.max(4, internalPage.toString().length + 2);

  let disableLeft = !isRendererEnabled, disableRight = !isRendererEnabled;
  let maxPageBatch = Math.ceil(batchSize/rendersPerPage);
  
  if (renderMode === "prerender") {
    disableLeft ||= pageNumber === 1;
    disableRight ||= pageNumber === maxPageBatch;
  }

  useEffect(() => {
    setInternalPage(pageNumber);
    if (renderMode !== "continuous" || !isRendererEnabled) return;
    
    api.post("/api/render/range", { range: [startSeed + (pageNumber - 1)*rendersPerPage, startSeed + (pageNumber + prerenderPages)*rendersPerPage - 1] }).then(() => setRendererState(rs.RENDERING));

  }, [pageNumber]);

  async function updatePage(value) {
    value = parseInt(value);
    if (renderMode === "continuous" || (value > 0 && value <= maxPageBatch)) {
      set(internalPage)
    } else {
      setInternalPage(pageNumber);
    }
  }

  return (
    <HStack h="5rem">
      <IconButton variant="outline" isDisabled={disableLeft} icon={<IoMdArrowDropleft />} onClick={decrement}  />
      <Input isDisabled={!isRendererEnabled} w={`${inputWidth}ch`} type="number" textAlign="center" p={0} value={internalPage} onChange={e => setInternalPage(parseInt(e.target.value))} onBlur={() => updatePage(internalPage)} onKeyUp={(e) => e.key === "Enter" && updatePage(internalPage)} />
      <IconButton variant="outline" isDisabled={disableRight} icon={<IoMdArrowDropright />} onClick={increment} />
    </HStack>
  )
}
