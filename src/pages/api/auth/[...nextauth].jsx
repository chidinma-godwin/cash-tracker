import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// CashTracker Imports
import apiRequest from 'utils/apiRequest';
import { loginEndpoint, signupEndpoint } from 'constants/endpoints';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_ID,
      clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: 'Username and Password',
      async authorize(credentials) {
        const { response } = await apiRequest(loginEndpoint, credentials);
        const { user, message } = await response.json();
        if (user) {
          return user;
        }
        throw new Error(message);
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
  callbacks: {
    async signIn({ user }) {
      console.info(user);
      try {
        const { name, email } = user;
        const { response } = await apiRequest(signupEndpoint, {
          name,
          email,
          usePassword: false,
        });
        if (response.status === 201) {
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    },
  },
  debug: false,
});
