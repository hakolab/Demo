import React from 'react'
import { Button } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core'
import { Grid } from './Grid'
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  breakpoints: {
    keys: ["spPortrait", "spLandscape", "pc"],
    values: {
      spPortrait: 0,
      spLandscape: 520,
      pc: 960
    },
  },
})

export const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Grid container>
          <Grid item spPortrait={6} spLandscape={4}>
            <Button variant="contained" color="primary">test</Button>
          </Grid>
          <Grid item  spPortrait={6} spLandscape={4} pc={2}>
            <Button variant="contained" color="primary">test</Button>
          </Grid>
          <Grid item  spPortrait={6} spLandscape={4} pc={2}>
            <Button variant="contained" color="primary">test</Button>
          </Grid>
          <Grid item  spPortrait={6} spLandscape={4} pc={2}>
            <Button variant="contained" color="primary">test</Button>
          </Grid>
          <Grid item  spPortrait={6} spLandscape={4} pc={2}>
            <Button variant="contained" color="primary">test</Button>
          </Grid>
          <Grid item  spPortrait={6} spLandscape={4} pc={2}>
            <Button variant="contained" color="primary">test</Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>

  )
}