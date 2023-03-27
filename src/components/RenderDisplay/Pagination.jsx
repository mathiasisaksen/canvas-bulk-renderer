import { HStack, IconButton, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import usePageNumber from '@/store/page-number-store'
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io';
import useConfig from '@/store/config-store'
import useRenderData from '@/store/render-data-store';

export default function Pagination() {
  const [pageNumber, setPage, increment, decrement] = usePageNumber((state) => [state.pageNumber, state.setPage, state.increment, state.decrement]);
  const [internalPage, setInternalPage] = useState(pageNumber);
  const isRendererEnabled = useRenderData((state) => state.isRendererEnabled());
  const { renderMode, batchSize, rendersPerPage } = useConfig((state) => state.getConfig());

  const inputWidth = Math.max(4, internalPage.toString().length + 2);

  let disableLeft = !isRendererEnabled;
  let disableRight = !isRendererEnabled;
  const maxPageBatch = Math.ceil(batchSize/rendersPerPage);
  
  if (renderMode === "prerender") {
    disableLeft ||= pageNumber === 1;
    disableRight ||= pageNumber === maxPageBatch;
  }

  useEffect(() => {
    setInternalPage(pageNumber);
  }, [pageNumber]);

  async function updatePage(value) {
    if (!setPage(value)) {
      setInternalPage(pageNumber);
    }
  }

  return (
    <HStack>
      <IconButton variant="outline" isDisabled={disableLeft} icon={<IoMdArrowDropleft />} onClick={() => setPage(pageNumber - 1)}  />
      <Input isDisabled={!isRendererEnabled} w={`${inputWidth}ch`} type="number" textAlign="center" p={0} value={internalPage} onChange={e => setInternalPage(parseInt(e.target.value))} onBlur={() => updatePage(internalPage)} onKeyUp={(e) => e.key === "Enter" && updatePage(internalPage)} />
      <IconButton variant="outline" isDisabled={disableRight} icon={<IoMdArrowDropright />} onClick={() => setPage(pageNumber + 1)} />
    </HStack>
  )
}
