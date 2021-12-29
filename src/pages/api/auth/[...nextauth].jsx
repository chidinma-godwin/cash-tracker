import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

// CashTracker Imports
import { loginEndpoint, signupEndpoint } from 'constants/endpoints';
import User from 'models/User';
import dbConnect from 'utils/dbConnect';
import apiRequest from 'utils/apiRequest';
import { getClientDetails } from 'utils/user';

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
    async signIn(data) {
      const { user, account } = data;
      if (account.provider === 'google') {
        try {
          const { name, email } = user;
          await dbConnect();
          const existingUser = await User.findOne({ email });
          if (!existingUser) {
            const { ok } = await apiRequest(signupEndpoint, {
              name,
              email,
              usePassword: false,
            });
            if (!ok) {
              return false;
            }
          }
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return true;
      }
    },
    async session({ session, token }) {
      await dbConnect();
      const user = await User.findOne({ email: token?.email });
      const clientDetails = await getClientDetails(
        user.clientsEmail,
        user.pendingRequests
      );
      return {
        ...session,
        user: { ...user, clientDetails },
      };
    },
  },
  debug: false,
});
