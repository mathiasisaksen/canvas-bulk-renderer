import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import RenderBox from '@/components/RenderBox'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  return (
    <Flex>
      <Sidebar />
      <Flex flex={1} w="100%" dir="row" align="flex-start" justify="center" wrap="wrap" ml="3" pt="10">
        {Array(20).fill().map((_, i) => <RenderBox key={i} seed={i} />)}
      </Flex>
    </Flex>
  )
}

/*export function getServerSideProps() {

}*/