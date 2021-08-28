import React, { Fragment, useState } from 'react';
import { createMuiTheme, ThemeProvider, makeStylesm, useTheme, useMediaQuery } from '@material-ui/core'
import { orange } from '@material-ui/core/colors';

const theme = createMuiTheme({
  breakpoints: {
    keys: ["xs", "tiny", "sm", "md", "lg", "xl", ],
    values: {
      xs: 0,
      tiny: 430,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    }
  },
});



function CustomDiv(){
  const _theme = useTheme()
  console.log(_theme.breakpoints)
  const match = useMediaQuery(_theme.breakpoints.down('tiny'))
  //const match = useMediaQuery('(min-width:600px)')
  return (
    <div>
      {match ? "true" : "false"}
    </div>
  )
}

function App() {

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <CustomDiv />
      </ThemeProvider>
    </Fragment>
  );
}

export default App