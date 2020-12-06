import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  // #0c0032
  palette: {
    primary: {
      main: '#242582',
    },
    secondary: {
      main: '#0ee623',
    },
    error: {
      main: '#d83434',
    },
    background: {
      default: '#fff',
    },
  },
  overrides: {
    MuiTextField: {
      root: {
        marginBottom: '1.5rem',
      },
    },
    MuiFormHelperText: {
      root: {
        color: '#ce0a0a',
      },
    },
  },
});

export default theme;
