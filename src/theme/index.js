import { extendTheme } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';

const theme = extendTheme({
  styles: {
    global: props => ({
      body: {
        background: mode("linear-gradient(180deg,#fafafa,#F7FAFC)", "linear-gradient(180deg, #171923,#1A202C)")(props)
      }
    })
  }
});

export default theme;