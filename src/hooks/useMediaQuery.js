import { useTheme, useMediaQuery } from '@material-ui/core'

export const useMediaQueryUp = (breakpoint) => {
    const theme = useTheme()
    return useMediaQuery(theme.breakpoints.up(breakpoint))
}

export const useMediaQueryDown = (breakpoint) => {
    const theme = useTheme()
    return useMediaQuery(theme.breakpoints.down(breakpoint))
}