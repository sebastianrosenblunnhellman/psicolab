// app/api/auth/[auth0]/route.js
    import { handleAuth,  } from '@auth0/nextjs-auth0';

    const getCallbackUrl = (req) => {
      if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:3000/api/auth/callback';
      }
      const host = req.headers.get('host');
      return `https://${host}/api/auth/callback`;
    };

    export const GET = handleAuth({
      callbackUrl: (req) => getCallbackUrl(req),
    });
