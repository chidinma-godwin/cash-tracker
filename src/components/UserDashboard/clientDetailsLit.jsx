import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PersonIcon from '@material-ui/icons/Person';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import PropTypes from 'prop-types';

// CashTracker Imports
import { useUser } from 'utils/hooks';

const useStyles = makeStyles(theme => ({
  deletedTextRoot: {
    color: theme.palette.error.main,
  },
  pendingTextRoot: {
    color: '#1c7e82',
  },
}));

export default function ClientDetailsList({
  handleTransactionAccount,
  handleShowDialog,
}) {
  const classes = useStyles();
  const { user } = useUser();

  return (
    <Card raised>
      <CardHeader
        title='Transaction Accounts'
        subheader='Username of people you have a transaction account with'
      />
      <CardContent>
        {user.clientsDetails?.length ? (
          <List>
            {user.clientsDetails.map(client => {
              const deleted = user.deletedEmails.find(
                email => email === client.email
              );
              const pending = user.pendingRequests.find(
                email => email === client.email
              );
              return (
                <ListItem key={client.email}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={client.username}
                    secondary={client.email}
                    classes={{
                      // eslint-disable-next-line no-nested-ternary
                      root: deleted
                        ? classes.deletedTextRoot
                        : pending
                        ? classes.pendingTextRoot
                        : '',
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Link
                      href={{
                        pathname: '/transaction-details',
                        query: { clientEmail: client.email },
                      }}
                      passHref
                    >
                      <Button
                        edge='end'
                        variant='contained'
                        color='primary'
                        aria-label='view transaction'
                      >
                        View
                      </Button>
                    </Link>

                    <IconButton
                      edge='end'
                      aria-label='delete account'
                      onClick={() =>
                        handleTransactionAccount(
                          client.email,
                          'delete',
                          'account'
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography variant='body1' paragraph>
            You do not have any transaction account. Click on the button below
            to get started
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button variant='contained' size='small' onClick={handleShowDialog}>
          Add New Account
        </Button>
      </CardActions>
    </Card>
  );
}

ClientDetailsList.propTypes = {
  handleTransactionAccount: PropTypes.func.isRequired,
  handleShowDialog: PropTypes.func.isRequired,
};
