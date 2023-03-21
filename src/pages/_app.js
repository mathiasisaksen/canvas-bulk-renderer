import GlobalProvider from "@/context/GlobalProvider";
import theme from "@/theme";
import { ChakraProvider, Flex, useColorModeValue } from "@chakra-ui/react"

export default function App({ Component, pageProps }) {
  //const gradient = useColorModeValue("linear(to-b, gray.900, gray.800)", "linear(to-b, gray.100, gray.200)")
  return (
    <ChakraProvider theme={theme}>
      <Flex w="100%" h="100vh" dir='row' align="center" justify="center" px="5">
        <Flex w="100%" maxW="1280px" h="100%">
          <Component {...pageProps} />
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}
