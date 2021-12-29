import Head from 'next/head';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

// CashTracker Imports
import Header from './header';

const useStyles = makeStyles({
  gridRoot: {
    marginTop: '3em',
  },
});

export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.ico' />
        <title>Cash Tracker</title>
      </Head>
      <Header />
      <Grid container>
        <Grid item xs={1} md={2} />
        <Grid item xs={10} md={8} classes={{ root: classes.gridRoot }}>
          {children}
        </Grid>
        <Grid item xs={1} md={2} />
      </Grid>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
