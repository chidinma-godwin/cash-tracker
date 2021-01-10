import {
  loginEndpoint,
  signupEndpoint,
  transactionEndpoint,
  userEndpoint,
} from 'constants/endpoints';
import { createServer, Model } from 'miragejs';

export default function makeServer(environment = 'test') {
  return createServer({
    environment,
    models: {
      user: Model,
      transaction: Model,
    },
    routes() {
      this.get(userEndpoint, () => ({
        user: {
          id: '1',
          username: 'Authenticated User',
          email: 'user@email.com',
          clientsEmail: ['client1@email.com'],
          pendingInvitations: ['invite@email.com'],
          pendingRequests: ['pending1@email.com', 'pending2@email.com'],
        },
      }));
      this.post(signupEndpoint, (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.users.create(attrs);
      });
      this.post(loginEndpoint, (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        return schema.users.findBy({ email, password });
      });
      this.get(`${transactionEndpoint}/:id`, (schema, request) => {
        const { id } = request.params;
        return schema.transactions.where(transaction =>
          transaction.participants.includes(id)
        );
      });
      this.post(transactionEndpoint, (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.transactions.create(attrs);
      });
    },
  });
}
