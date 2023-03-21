import React from 'react'
import { Image, LinkBox, LinkOverlay, Skeleton } from '@chakra-ui/react';

export default function ImageContainer({ seed, data, isLoading, gridColumns }) {
  return (
    <LinkBox p="2" w={`calc(100% / ${gridColumns})`}>
      {isLoading ? 
        <Skeleton w="100%" style={{ aspectRatio: 1 }}/> :
        <LinkOverlay href={data?.url} target="_blank">
          <Image
            key={seed}
            src={isLoading ? "" : `data:image/png;base64,${data?.image}`}
            width="100%"
            alt=""
          />
        </LinkOverlay>
      }
    </LinkBox >
  )

}
