import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';

export default function PendingUserList({
  pendingInvitations = [],
  handleTransactionAccount,
}) {
  return (
    <>
      {Boolean(pendingInvitations?.length) && (
        <List>
          <Card raised>
            <CardHeader
              title='Pending Invitations'
              subheader='Accept the request to start transactions, otherwise you can decline the request'
            />
            <CardContent>
              {pendingInvitations.map(email => (
                <ListItem key={email}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={email} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge='end'
                      aria-label='confirm account'
                      onClick={() => handleTransactionAccount(email, 'add')}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      edge='end'
                      aria-label='delete request'
                      onClick={() => handleTransactionAccount(email, 'delete')}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </CardContent>
          </Card>
        </List>
      )}
    </>

    // <Card>
    //   <CardHeader
    //     title='Pending Sent Requests'
    //     subheader='Once the user accepts the request they will be added to your transaction accounts list'
    //   />
    //   <CardContent>
    //     <List>
    //       {pendingRequests.map(email => (
    //         <ListItem key={email}>
    //           <ListItemAvatar>
    //             <Avatar>
    //               <PersonIcon />
    //             </Avatar>
    //           </ListItemAvatar>
    //           <ListItemText primary={email} />
    //           <ListItemSecondaryAction>
    //             <IconButton
    //               edge='end'
    //               aria-label='delete request'
    //               onClick={() => handleTransactionAccount(email, 'delete', 'request')}
    //             >
    //               <DeleteIcon />
    //             </IconButton>
    //           </ListItemSecondaryAction>
    //         </ListItem>
    //       ))}
    //     </List>
    //   </CardContent>
    // </Card>
  );
}

PendingUserList.propTypes = {
  pendingInvitations: PropTypes.arrayOf(
    PropTypes.shape({ email: PropTypes.String })
  ).isRequired,
  handleTransactionAccount: PropTypes.func.isRequired,
};
