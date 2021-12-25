import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// CashTracker Imports
import apiRequest from 'utils/apiRequest';
import { loginEndpoint } from 'constants/endpoints';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Username and Password',
      async authorize(credentials) {
        let user;
        const { response } = await apiRequest(loginEndpoint, credentials);
        if (response.status === 201) {
          ({ user } = await response.json());
        }
        if (user) {
          return user;
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60, // 1 hour
  },
  pages: {
    signIn: '/account/login',
    signUp: '/account/signup',
    error: '/account/login',
    // NewUser: null // If set, new users will be directed here on first sign in
  },
  debug: true,
});
