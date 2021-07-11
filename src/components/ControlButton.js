import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faEraser, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useButtonStyles } from '../hooks/useButtonStyles';
import AlertDialog from './AlertDialog';
import clsx from 'clsx';

export default function ControlButton({start, stop, clear, allClear, isPlaying}){
  const classes = useButtonStyles();

  const [open, setOpen] = useState(false);

  const handleClickNo = () => {
    setOpen(false);
  };

  function handleClickOK(){
    allClear()
    setOpen(false)
  }

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
      <Button id="clear-all" type="button" className={clsx(classes.common, classes.dangerHover, open ? classes.dangerButton : '')} onClick={() => setOpen(true)} disabled={isPlaying}>
        <FontAwesomeIcon icon={faTrashAlt}/>
      </Button>
      <AlertDialog
        open={open}
        title={"ALL CLEAR"}
        text={"キーボードモード、拍子、小節数、テンポ、入力した音符をすべてクリアします。よろしいですか？"}
        confirm={true}
        onClickNo={handleClickNo}
        onClickOk={handleClickOK}
      />
    </ButtonGroup>
  )
}