import React from 'react'
import Button from '@material-ui/core/Button';

export default function StyledButton({children, onClick, size, disabled}){
  const classes = useButtonStyles();

  return (
    <Button type="button" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  )
}