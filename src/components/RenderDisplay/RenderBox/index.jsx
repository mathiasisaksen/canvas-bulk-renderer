import ImageContainer from '@/components/RenderDisplay/RenderBox/ImageContainer';
import api from '@/services/api';
import useUI from '@/store/ui-store';
import { Box, LinkBox, LinkOverlay, Skeleton, Text } from '@chakra-ui/react';

import React, { useEffect, useState } from 'react'

export default function RenderBox({ seed }) {
  const [data, setData] = useState();
  const gridColumns = useUI((state) => state.gridColumns);
  console.log('gridColumns: ', gridColumns);
  let isLoading = !data;

  useEffect(() => {
    const abortController = new AbortController();
    const start = performance.now();
      api.post(`/api/render/${seed}?`, { signal: abortController.signal }).then(({ data }) => {
        setData(data);
        console.log('Time: ', performance.now() - start);
    });

    return () => {
      abortController.abort();
    }

  }, [seed]);

  return (
    <ImageContainer seed={seed} isLoading={isLoading} data={data} gridColumns={gridColumns} />
  )
}



