import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Link from 'next/link';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  linkStyle: {
    color: '#fff',
    textDecoration: 'none',
  },
});

export default function ButtonAppBar() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Container>
          <Toolbar>
            <Typography variant='h5' className={classes.title}>
              <Link href='/'>
                <a className={classes.linkStyle}>Cash Tracker</a>
              </Link>
            </Typography>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-haspopup='true'
              color='inherit'
            >
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
