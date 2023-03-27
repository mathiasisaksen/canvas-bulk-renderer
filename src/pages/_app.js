import customTheme from "@/theme";
import { ChakraProvider, Flex } from "@chakra-ui/react"

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme}>
      <Flex w="100%" h="100lvh" align="center" justify="center" p="5">
        <Flex w="100%" h="100%">
          <Component {...pageProps} />
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}
