import React from 'react'
import { Grid, makeStyles, Slider, withStyles } from '@material-ui/core'
import { isIOS } from 'react-device-detect'

const useSliderStyles = makeStyles(theme => ({
  icon: {
    color: theme.palette.text.primary,
  },
  disabled: {
    color: theme.palette.action.disabled,
  }
}))

const iOSBoxShadow =
'0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = withStyles({
  root: {
    color: '#3880ff',
    height: 2,
    padding: '10px 0',
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    marginTop: -10,
    marginLeft: -10,
    '&:focus, &:hover, &:active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
  },
  active: {},
  track: {
    height: 2,
  },
  rail: {
    height: 2,
    opacity: 0.5,
    backgroundColor: '#808080',
  },
})(Slider);

export default function ControlSlider({value, onChange, onChangeCommitted, min, max, onMouseDown, disabled, iconRotate, IconLeft, IconRight}){
  const classes = useSliderStyles()
  return (
    <Grid container spacing={1}>
      <Grid item>
        <IconLeft
          className={classes.icon, disabled ? classes.disabled : ''}
          style={iconRotate ? {transform: "rotate(90deg)"} : {}}
          />
      </Grid>
      <Grid item xs>
        {
          isIOS
          ? <IOSSlider
              value={value}
              onChange={onChange}
              min={min}
              max={max}
              onMouseDown={onMouseDown}
              onChangeCommitted={onChangeCommitted}
              disabled={disabled}
              valueLabelDisplay="auto"
            />
          : <Slider
              value={value}
              onChange={onChange}
              min={min}
              max={max}
              onMouseDown={onMouseDown}
              onChangeCommitted={onChangeCommitted}
              disabled={disabled}
              valueLabelDisplay="auto"
            />
        }
      </Grid>
      <Grid item>
        <IconRight
          className={classes.icon, disabled ? classes.disabled : ''}
          style={iconRotate ? {transform: "rotate(90deg)"} : {}}
          />
      </Grid>
    </Grid>
  )
}