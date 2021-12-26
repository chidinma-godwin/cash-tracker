import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    overflow: 'hidden',
    background: theme.palette.secondary.main,

    '@media (max-width:800px)': {
      minHeight: '800px',
      height: '100vh',
    },

    '&::before': {
      content: `''`,
      position: 'absolute',
      width: '2000px',
      height: '2000px',
      background: `linear-gradient(-45deg, ${theme.palette.primary.main} , #5354eb)`,
      borderRadius: '50%',
      top: '10%',
      right: '48%',
      transform: 'translateY(-50%)',
      transition: '1.5s ease-in-out',
      zIndex: 6,

      '@media (max-width:800px)': {
        width: '1500px',
        height: '1500px',
        top: 'initial',
        right: 'initial',
        bottom: '68%',
        left: '30%',
        transform: 'translate(-50%)',
      },
    },
    '&.animate::before': {
      transform: 'translate(100%, -50%)',
      right: '52%',

      '@media (max-width:800px)': {
        transform: 'translate(-50%, 100%)',
        right: 'initial',
        bottom: '32%',
      },
    },
    '&.animate $rightPanel $content, &.animate $rightPanel img': {
      transform: 'translateX(0)',
    },
    '&.animate $leftPanel $content, &.animate $leftPanel img': {
      transform: 'translateX(-800px)',

      '@media (max-width:800px)': {
        transform: 'translateY(-300%)',
      },
    },
    '&.animate $rightPanel': {
      pointerEvents: 'all',
    },
    '&.animate $leftPanel': {
      pointerEvents: 'none',
    },
    '&.animate $accounts': {
      left: '25%',
      '@media (max-width:800px)': {
        top: '5%',
        transform: 'translate(-50%, 0)',
        left: '50%',
      },
    },
    '&.animate $signUp': {
      opacity: 1,
      zIndex: 2,
    },
    '&.animate $signIn': {
      opacity: 0,
      zIndex: 1,
    },
  },
  formsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  accounts: {
    position: 'absolute',
    width: '50%',
    top: '50%',
    left: '75%',
    transform: 'translate(-50%, -50%)',
    display: 'grid',
    gridTemplateColumns: '1fr',
    zIndex: 5,
    padding: '0 2.5rem',
    transition: '1.5s ease-in-out',

    '@media (max-width:800px)': {
      top: '95%',
      left: '50%',
      width: '100%',
      padding: '0 1rem',
      transform: 'translate(-50%, -100%)',
    },
  },
  panelsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',

    '@media (max-width:800px)': {
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 2fr 1fr',
    },
  },
  panel: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 7,

    '@media (max-width:800px)': {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },

    '& img': {
      width: '80%',
      transition: '1.5s ease-in-out',

      '@media (max-width:800px)': {
        width: '200px',
      },

      '@media (max-width:570px)': {
        display: 'none',
      },
    },
  },
  leftPanel: {
    pointerEvents: 'all',
    padding: '3rem 17% 2rem 12%',

    '@media (max-width:800px)': {
      gridColumn: '1 / 4',
      padding: '1rem',
    },
  },
  rightPanel: {
    pointerEvents: 'none',
    padding: '3rem 12% 2rem 17%',

    '@media (max-width:800px)': {
      gridColumn: '3 / 4',
      padding: '1rem',
      transform: 'translateY(250px)',
    },

    '& $content, & img': {
      transform: 'translateX(800px)',
    },
  },
  buttonStyles: {
    color: '#fff',
    borderColor: '#fff',
  },
  content: {
    color: '#fff',
    transition: '1.5s ease-in-out',

    '@media (max-width:800px)': {
      paddingRight: '15%',
    },

    '@media (max-width:570px)': {
      paddingRight: 0,
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#fff',
    padding: '1rem',
    borderRadius: '10px',
    gridRow: '1 / 2',
    gridColumn: '1 / 2',
    overflow: 'hidden',
    transition: '1.5s ease-in-out',
  },
  signUp: {
    opacity: 0,
    zIndex: 1,
  },
  signIn: {
    zIndex: 2,
  },
}));

export default useStyles;
