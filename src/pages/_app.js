import { ChakraProvider, Flex } from "@chakra-ui/react"

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Flex w="100%" h="100%" dir='row' align="center" justify="center">
        <Flex w="100%" maxW="1000px" h="100%">
          <Component {...pageProps} />
        </Flex>
      </Flex>      
    </ChakraProvider>
  );
}
