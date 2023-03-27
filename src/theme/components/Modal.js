import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle(props => ({
  dialog: {
    backgroundColor: mode("#fafafaf5", "#090a10f5")(props)
  }
}));

export const modalTheme = defineMultiStyleConfig({ 
  baseStyle
});
