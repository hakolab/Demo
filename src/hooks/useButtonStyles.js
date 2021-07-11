import { makeStyles } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';

export const useButtonStyles = makeStyles(theme => ({
  common: {
    [theme.breakpoints.down('xs')]: {
      fontSize: "12px",
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: "14px",
    },
    height: "30px",
    color: theme.palette.primary.dark,
  },
  danger: {
    transition: theme.transitions.create(['color', 'border'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      border: "1px solid " + theme.palette.error.main, 
      color: theme.palette.error.main,
      backgroundColor: 'transparent',
    },
  }
}));