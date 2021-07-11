import { makeStyles } from '@material-ui/core';

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
  ok: {
    color: theme.palette.success.main
  },
  dangerColor: {
    color: theme.palette.error.main,
  },
  dangerButton: {
    color: theme.palette.error.main,
    border: "1px solid " + theme.palette.error.main, 
  },
  dangerHover: {
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