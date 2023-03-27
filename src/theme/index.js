import { extendTheme, getToken, toVarDefinition } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';
import { theme } from "@chakra-ui/react";
import components from "@/theme/components";
import fonts from "@/theme/fonts";

const breakpoints = {
  ...theme.breakpoints,
  md: "50em"
}

const [white, lightYellow, darkBlue, darkGray] = ["#fafafa", "#FFFFF0", "#181826", "#171923"];

const customTheme = extendTheme({
  components,
  breakpoints,
  fonts,
  styles: {
    global: props => ({
      body: {
        background: mode(`linear-gradient(180deg,${white},${lightYellow})`, `linear-gradient(180deg, ${darkGray},${darkBlue})`)(props)
      }
    })
  }
});

export default customTheme;