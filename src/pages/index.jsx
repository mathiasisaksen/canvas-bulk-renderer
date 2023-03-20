
import { Inter } from 'next/font/google'
import { Flex } from '@chakra-ui/react'
import Sidebar from '@/components/Sidebar'
import RenderDisplay from '@/components/RenderDisplay'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Flex w="100%">
      <Sidebar />
      <RenderDisplay />
    </Flex>
  )
}
