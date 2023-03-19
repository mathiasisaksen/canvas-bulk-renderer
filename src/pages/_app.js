import { ChakraProvider, Flex } from "@chakra-ui/react"

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Flex w="100%" h="100%" dir='row' align="center" justify="center" px="5">
        <Flex w="100%" maxW="1280px" h="100%">
          <Component {...pageProps} />
        </Flex>
      </Flex>      
    </ChakraProvider>
  );
}
