import React, { Fragment, useState, useRef } from "react"
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import * as AppData from "../AppData"
import { useButtonStyles } from "./useButtonStyles";

export default function SelectBeatButton({beatIndex, disabled, onSelect, size}){
  const classes = useButtonStyles()
  /** プルダウンボタン開閉フラグ */
  const [open, setOpen] = useState(false);
  /** プルダウンボタン用Ref */
  const anchorRef = useRef(null);

  const handleMenuItemClick = (event, index) => {
    setOpen(false);
    onSelect({type: "changeBeat", payload: index})
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };


  return (
    <Fragment>
      <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button" variant="outlined" disableRipple  disabled={disabled} size={size}>
      <Button>{AppData.beatOptions[beatIndex].value}</Button>
      <Button
        color="primary"
        size="small"
        aria-controls={open ? 'split-button-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-label="select merge strategy"
        aria-haspopup="menu"
        onClick={handleToggle}
      >
        <ArrowDropDownIcon fontSize={size}/>
      </Button>
    </ButtonGroup>
    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList id="split-button-menu">
                {AppData.beatOptions.map((option, index) => (
                  <MenuItem
                    key={option.key}
                    selected={index === beatIndex}
                    onClick={(event) => handleMenuItemClick(event, index)}
                  >
                    {option.value}
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
    </Fragment>
  )
}