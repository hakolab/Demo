import React from 'react'
import { Grid, makeStyles, Slider } from '@material-ui/core'

const useSliderStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.primary
  }
}))

export default function ControlSlider({value, onChange, onChangeCommitted, min, max, onMouseDown, disabled, iconRotate, IconLeft, IconRight}){
  const classes = useSliderStyles()
  return (
    <Grid container spacing={1}>
      <Grid item>
        <IconLeft className={classes.icon} style={iconRotate ? {transform: "rotate(90deg)"} : {}}/>
      </Grid>
      <Grid item xs>
        <Slider
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          onMouseDown={onMouseDown}
          onChangeCommitted={onChangeCommitted}
          disabled={disabled}
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item>
        <IconRight className={classes.icon} style={iconRotate ? {transform: "rotate(90deg)"} : {}}/>
      </Grid>
    </Grid>
  )
}