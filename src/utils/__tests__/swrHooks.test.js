import { Response } from 'miragejs';

import { transactionEndpoint, userEndpoint } from 'constants/endpoints';
import makeServer from 'testUtils/apiMock';
import { renderHook } from 'testUtils';
import { useUser, useTransaction } from '../swrHooks';

describe('swrHooks', () => {
  let server;
  beforeEach(() => {
    server = makeServer();
  });
  afterEach(() => {
    server.shutdown();
  });
  describe('useUser', () => {
    const user = {
      id: '1',
      username: 'Authenticated User',
      email: 'user@email.com',
      clientsEmail: ['client1@email.com'],
      pendingInvitations: ['invite@email.com'],
      pendingRequests: ['pending1@email.com', 'pending2@email.com'],
    };
    it('returns correct data when request fails', async () => {
      server.get(userEndpoint, () => new Response(500));
      const { result, waitFor } = renderHook(() => useUser());

      await waitFor(() => {
        expect(result.current).toEqual({
          user: undefined,
          loading: false,
          mutate: expect.any(Function),
        });
      });
    });
    it('returns correct data when request resolves successfully', async () => {
      server.create('user', user);
      const { result, waitFor } = renderHook(() => useUser());

      // Don't await result to simulate when request is still processing
      expect(result.current).toEqual({
        user: undefined,
        loading: true,
        mutate: expect.any(Function),
      });

      await waitFor(() => {
        expect(result.current).toEqual({
          user,
          loading: false,
          mutate: expect.any(Function),
        });
      });
    });
  });
  describe('useTransaction', () => {
    const transaction1 = {
      id: '1',
      participants: ['userId1', 'userId2'],
      currency: 'NGN',
      editors: ['me@email.com'],
      statusChangers: ['me@email.com'],
      lastEditorCanChangeStatus: true,
      creator: 'me@email.com',
    };
    const transaction2 = {
      id: '2',
      participants: ['userId2', 'anotherId'],
      currency: 'NGN',
      editors: ['email@email.com'],
      statusChangers: ['email@email.com'],
      lastEditorCanChangeStatus: true,
      creator: 'email@email.com',
    };
    const transaction3 = {
      id: '3',
      participants: ['userId1', 'anotherId'],
      currency: 'NGN',
      editors: ['me@email.com', 'another@email.com'],
      statusChangers: ['me@email.com'],
      lastEditorCanChangeStatus: true,
      creator: 'another@email.com',
    };
    it('returns correct data when request resolves successfully', async () => {
      server.create('transaction', transaction1);
      server.create('transaction', transaction2);
      server.create('transaction', transaction3);
      const { result, waitFor } = renderHook(() => useTransaction('userId1'));
      // Don't await result to simulate when request is still processing
      expect(result.current).toEqual({
        transactions: undefined,
        loading: true,
        mutate: expect.any(Function),
      });

      await waitFor(() => {
        expect(result.current).toEqual({
          transactions: [transaction1, transaction3],
          loading: false,
          mutate: expect.any(Function),
        });
      });
    });
    it('returns correct data when request fails', async () => {
      server.get(`${transactionEndpoint}/:id`, () => new Response(500));

      const { result, waitFor } = renderHook(() => useTransaction('userId2'));

      await waitFor(() => {
        expect(result.current).toEqual({
          transactions: undefined,
          loading: false,
          mutate: expect.any(Function),
        });
      });
    });
  });
});
