import api from '@/services/api';
import { Box, Skeleton, Text } from '@chakra-ui/react';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function RenderBox({ seed }) {
  const [data, setData] = useState();
  let isLoading = !data;
  useEffect(() => {
    async function fetchRender() {
      const start = performance.now();
      let { data } = await api.get(`/api/render/${seed}`);
      console.log('Time: ', performance.now() - start);
      setData(data);
    }
    fetchRender();
  }, [seed]);

  return (
    <Box p="2">
      <Skeleton isLoaded={!isLoading}>
        <Image
          key={seed}
          src={`data:image/png;base64,${data?.image}`}
          width={150}
          height={225}
          alt=""
        ></Image>
      </Skeleton>
      
    </Box>

  )
}
