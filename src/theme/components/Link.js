
export const linkTheme = {
  variants: {
    primary: ({ colorMode, colorScheme = "pink" } = {}) => ({
      color: `${colorScheme}.${colorMode === "dark" ? 400 : 600}`,
    })
  },
  defaultProps: {
    variant: "primary"
  }
};
