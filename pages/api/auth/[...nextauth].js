import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";






async function refreshAccessTokenCredentials(token) {
  const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "api/auth/token/refresh/";
  const payload = {
    refresh: token.refreshToken,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      error: undefined,
      accessToken: refreshedTokens.access,
      accessTokenExpires: Math.floor(new Date(refreshedTokens.access_token_expiration)),
      refreshToken: refreshedTokens.refresh ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}



export default NextAuth({
  // Base URL for NextAuth (set via NEXTAUTH_URL environment variable)
  // This ensures the redirect URI is correctly constructed for OAuth callbacks
  // For localhost: http://localhost:4000
  // For production: https://chitralhive.com
  // IMPORTANT: Set NEXTAUTH_URL in your production environment variables
  // Remove trailing slash if present to avoid routing issues
  ...(process.env.NEXTAUTH_URL && { 
    url: process.env.NEXTAUTH_URL.endsWith('/') 
      ? process.env.NEXTAUTH_URL.slice(0, -1) 
      : process.env.NEXTAUTH_URL 
  }),
  
  secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET,
  
  // Debug mode for development (remove in production)
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const payload = {
          username: credentials.username,
          password: credentials.password,
          role: credentials.role,
        };
        const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "api/auth/login/";
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorization: GOOGLE_AUTHORIZATION_URL,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors to login page
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },

    async jwt({ token, user, account , profile}) {
      if (account?.provider === "credentials") {
        if (user && account) {
          
          token = {
            ...token,
            accessToken: user.access_token,
            refreshToken: user.refresh_token,
            accessTokenExpires: Math.floor(new Date(user.access_token_expiration)),
            refreshTokenExpires: Math.floor(new Date(user.refresh_token_expiration)),
            user: user.user,
            provider: account.provider,
          };
          return token;
        }
      }

      if (account && user && account.provider === "google") {
        const response = await axios({
          method: "post",
          url: process.env.NEXT_PUBLIC_BACKEND_API_BASE + "google/",
          data: {
            access_token: account.access_token,
            id_token: account.id_token,
          },
        });

        const { access_token, refresh_token, user, access_token_expiration, refresh_token_expiration } =
          response.data;

        token = {
          ...token,
          accessToken: access_token,
          refreshToken: refresh_token,
          accessTokenExpires: Math.floor(new Date(access_token_expiration)),
          refreshTokenExpires: Math.floor(new Date(refresh_token_expiration)),
          user: user,
          provider: account.provider,
        };

        return token;
      }

      if (account && user && account.provider === "facebook") {
        console.log("facebook: account", account)
        console.log("facebook: profile", profile)
        const response = await axios({
          method: "post",
          url: process.env.NEXT_PUBLIC_BACKEND_API_BASE + "facebook/",
          data: {
            access_token: account.access_token,
          },
        });

        const { access_token, refresh_token, user, access_token_expiration, refresh_token_expiration } =
          response.data;
        user.name = profile.name
        user.picture=  profile.picture.data.url
        token = {
          ...token,
          accessToken: access_token,
          refreshToken: refresh_token,
          accessTokenExpires: Math.floor(new Date(access_token_expiration)),
          refreshTokenExpires: Math.floor(new Date(refresh_token_expiration)),
          user: user,
          provider: account.provider,
        };

        return token;
      }

      if (token) {
        const currentTime = Date.now();

        if (currentTime < token.accessTokenExpires) {
          return token;
        }

        return refreshAccessTokenCredentials(token);
      }

      return token;
    },

    //,trigger, newSession
    async session({ session, token }) {
      if (token) {
        // Set session properties from the token
        session.accessToken = token.accessToken;
        session.user = token.user;
        session.provider = token.provider;

        const url = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "getCusWishlists";

        if (session.accessToken) {
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + session.accessToken,
              },
              body: JSON.stringify({ id: session.user.id }),
            });

            if (response.ok) {
              const wishlistdata = await response.json();
         
              session.wishlist = wishlistdata;
            } else {
            }
          } catch (error) {
          }
        }

        return session; 
      }

      
      return {};
    },

  },
});
