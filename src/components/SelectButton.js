import React from 'react'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useButtonStyles } from '../hooks/useButtonStyles'
import { useMediaQueryDown } from '../hooks/useMediaQuery';

export default function SelectButton({data, onClick, action, disabled}){
  const classes = useButtonStyles();
  const isMatch = useMediaQueryDown('xs')
  return (
    <ButtonGroup color="primary" aria-label="outlined primary button group" size={isMatch ? 'small' : 'medium'}>
      {data.map(obj => {
        return (
          <Button
            key={obj.mode}
            className={classes.common}
            onClick={() => onClick({type: action, payload: obj.mode})}
            disabled={disabled}
            >
              {obj.viewName}
            </Button>)
      })}
    </ButtonGroup>
  )
}