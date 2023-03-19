import { Box, Skeleton, Text } from '@chakra-ui/react';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function RenderBox({ seed }) {
  const [data, setData] = useState();
  let isLoading = !data;
  useEffect(() => {
    async function fetchRender() {
      let { data } = await axios.get(`/api/render/${seed}`);
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
