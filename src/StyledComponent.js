import React, { Fragment } from "react";
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root: {
    ...theme.typography.button,
    color: "red",
    border: "1px solid black",
    borderRadius: theme.shape.borderRadius,
  }
})


function StyledComponent(props){
  return (
    <Fragment>
      <button className={props.classes.root}>test</button>
    </Fragment>
  )
}

export default withStyles(styles)(StyledComponent)