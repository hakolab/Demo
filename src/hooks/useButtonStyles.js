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
}));