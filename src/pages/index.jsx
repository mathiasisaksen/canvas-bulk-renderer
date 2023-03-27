
import { Flex, useToken } from '@chakra-ui/react'
import Sidebar from '@/components/Sidebar'
import RenderDisplay from '@/components/RenderDisplay'
import useGlobalKeyListeners from '@/hooks/use-global-key-listeners'
import Head from 'next/head'

export default function Home() {
  useGlobalKeyListeners();
  return (
    <>
    <Head>
      <title>Canvas Bulk Renderer</title>
    </Head>
    <Flex w="100%" h="100%" gap="4">
      <Sidebar />
      <RenderDisplay />
    </Flex>
    </>
  )
}
