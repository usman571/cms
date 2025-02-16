import axios from 'axios';
import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { User } from 'next-auth';

// Extend the User type to include accessToken
interface CustomUser extends User {
  accessToken?: string;
}

// Extend the JWT type
interface CustomJWT extends JWT {
  accessToken?: string;
}

// Define types for responses
interface AuthResponse {
  status: boolean;
  accessToken?: string;
  code?: string;
  message?: string;
}

interface UserProfileResponse {
  status: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
  code?: string;
  message?: string;
}

const authenticateWithServer = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_APP_SERVER_URL}api/auth/login`,
      { email, password }
    );
    const accessToken = response?.data?.data?.accessToken;
    if (accessToken) {
      return { status: true, accessToken };
    }
  } catch (error: any) {
    console.error('An error occurred while authenticating:', error);
  }
  return { status: false, code: 'AUTH_0001', message: 'Error authenticating' };
};

const getUserProfileFromServer = async (
  accessToken: string
): Promise<UserProfileResponse> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_SERVER_URL}api/auth/who-am-i`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const userData = response?.data?.data;

    if (userData?._id) {
      return {
        status: true,
        user: {
          id: userData._id,
          email: userData.email,
          username: userData.username,
          role: userData.role
        }
      };
    }
  } catch (error) {
    console.error('An error occurred while getting user profile:', error);
  }
  return {
    status: false,
    code: 'AUTH_0002',
    message: 'Error validating user token'
  };
};

const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials, req) {
        if (process.env.NEXT_PUBLIC_FAKE_LOGIN === 'true') {
          return { id: '1', name: 'Admin', email: 'dummy@admin.com' };
        }
        const authResponse = await authenticateWithServer(
          credentials.email as string,
          credentials.password as string
        );

        if (!authResponse.status || !authResponse.accessToken) {
          return null;
        }
        const profileResponse = await getUserProfileFromServer(
          authResponse.accessToken
        );

        if (!profileResponse.status || !profileResponse.user) {
          return null;
        }

        return {
          ...profileResponse.user,
          accessToken: authResponse.accessToken
        } as CustomUser;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: CustomJWT; user?: CustomUser }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: CustomJWT }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/'
  }
} satisfies NextAuthConfig;

export default authConfig;
