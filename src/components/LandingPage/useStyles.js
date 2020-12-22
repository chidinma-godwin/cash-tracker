import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  intro: {
    background: theme.palette.primary.main,
    position: 'relative',
    height: '80vh',
    padding: '3em',
    paddingTop: '2em',
  },
  buttonWrapper: {
    width: 'fit-content',
    marginLeft: 'auto',
    marginBottom: '1em',
  },
  buttonStyles: {
    fontSize: '1.5rem',
    color: '#fff',
    padding: '10px 20px',
    display: 'inline-block',
    position: 'relative',
    textDecoration: 'none',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: '0.2s',
    borderRadius: '50px',

    '&:hover': {
      background: theme.palette.secondary.main,
      boxShadow: '0 0 10px #0ee623, 0 0 40px #0ee623, 0 0 80px #0ee623',
      transitionDelay: '0.5s',
    },

    '& span': {
      position: 'absolute',
      display: 'block',
      opacity: 0,
    },

    '& span:nth-child(1)': {
      top: 0,
      left: '-100%',
      height: '4px',
      width: '100%',
      background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.main})`,
    },
    '&:hover span:nth-child(1)': {
      left: '100%',
      opacity: 1,
      transition: '0.5s',
    },
    '& span:nth-child(3)': {
      bottom: 0,
      right: '-100%',
      height: '4px',
      width: '100%',
      background: `linear-gradient(270deg, transparent, ${theme.palette.secondary.main})`,
    },
    '&:hover span:nth-child(3)': {
      right: '100%',
      opacity: 1,
      transition: '0.5s',
      transitionDelay: '0.3s',
    },
    '& span:nth-child(2)': {
      top: '-100%',
      right: 0,
      width: '4px',
      height: '100%',
      background: `linear-gradient(180deg, transparent, ${theme.palette.secondary.main})`,
    },
    '&:hover span:nth-child(2)': {
      top: '100%',
      opacity: 1,
      transition: '0.5s',
      transitionDelay: '0.2s',
    },
    '& span:nth-child(4)': {
      bottom: '-100%',
      left: 0,
      width: '4px',
      height: '100%',
      background: `linear-gradient(180deg, transparent, ${theme.palette.secondary.main})`,
    },
    '&:hover span:nth-child(4)': {
      bottom: '100%',
      opacity: 1,
      transition: '0.5s',
      transitionDelay: '0.4s',
    },
  },
  subSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '20vh',
    padding: '0 3em',
    background: theme.palette.secondary.main,
  },
  glowWrapper: {
    display: 'inline-flex',
    flexWrap: 'wrap',
  },
  glowText: {
    padding: 0,
    margin: 0,
    marginRight: '0.3em',
    color: '#000',
    fontSize: '6em',
    height: 'fit-content',
    letterSpacing: '4px',
    fontWeight: 'bolder',
    [theme.breakpoints.down('sm')]: {
      fontSize: '3rem',
    },
    '& span': {
      display: 'table-cell',
      margin: 0,
      padding: 0,
      color: '#fff',
      textShadow: '0 0 10px #fff, 0 0 40px #fff, 0 0 80px #fff',
    },
  },
  curve: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,

    '& path': {
      fill: theme.palette.secondary.main,
    },
  },
  subtitle: {
    fontSize: '2rem',
    letterSpacing: '3px',
    paddingTop: '1rem',
    color: 'lavenderblush',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
  },
}));

export default useStyles;
