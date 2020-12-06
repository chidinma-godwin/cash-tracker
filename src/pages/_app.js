/* eslint-disable react/prop-types */
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import 'styles/global.css';
import theme from 'theme';

// This default export is required in a new `pages/_app.js` file.
// eslint-disable-next-line react/prop-types
export default function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-styles');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <>
      {' '}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Component {...pageProps} />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </>
  );
}
