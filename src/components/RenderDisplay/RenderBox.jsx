import api from '@/services/api';
import { Box, LinkBox, LinkOverlay, Skeleton, Text } from '@chakra-ui/react';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function RenderBox({ seed }) {
  const [data, setData] = useState();
  let isLoading = !data;

  useEffect(() => {
    const abortController = new AbortController();
    function fetchRender() {
      const start = performance.now();
      api.post(`/api/render/${seed}?`, { signal: abortController.signal }).then(({ data }) => {
        setData(data);
        console.log('Time: ', performance.now() - start);
      });
    }
    fetchRender();

    return () => {
      abortController.abort();
    }

  }, [seed]);

  return (
    <Box p="2">
      <Skeleton isLoaded={!isLoading}>
        <LinkBox>
          <LinkOverlay href={data?.url} target="_blank">
            <Image
              key={seed}
              src={`data:image/png;base64,${data?.image}`}
              width={150}
              height={225}
              alt=""
            />
          </LinkOverlay>
        </LinkBox>

      </Skeleton>

    </Box>

  )
}
