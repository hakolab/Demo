import React from 'react'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faEraser, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useButtonStyles } from '../hooks/useButtonStyles';

export default function ControlButton({start, stop, clear, allClear, isPlaying}){
  const classes = useButtonStyles();

  return (
    <ButtonGroup color="primary" aria-label="outlined primary button group">
      {
        !isPlaying &&
          <Button type="button" className={classes.common} onClick={start}>
            <FontAwesomeIcon icon={faPlay}/>
          </Button>
      }
      {
        isPlaying &&
          <Button id="stop" type="button" className={classes.common} onClick={stop}>
            <FontAwesomeIcon icon={faStop}/>
          </Button>
      }        
      <Button id="clear" type="button" className={classes.common} onClick={clear} disabled={isPlaying}>
        <FontAwesomeIcon icon={faEraser}/>
      </Button>
      <Button id="clear-all" type="button" className={classes.common, classes.danger} onClick={allClear} disabled={isPlaying}>
        <FontAwesomeIcon icon={faTrashAlt}/>
      </Button>
    </ButtonGroup>
  )
}