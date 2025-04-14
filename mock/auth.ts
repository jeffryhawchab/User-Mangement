import { MethodType, MockMethod } from 'vite-plugin-mock';
import { generateResponse, generateToken } from './mock.util';

const mock: MockMethod[] = [
  {
    url: '/api/login',
    method: 'post',
    timeout: 2000,
    response: ({ body }: { body: any }) => {
      // More flexible body parsing - try different structures
      const credentials = body.body ? body.body : body;
      const { email, password } = credentials;

      if (!email || !password) {
        return generateResponse({}, 400, 'Email and password are required');
      }

      if (email === 'academy@gmail.com' && password === 'academy123') {
        const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
        const accessToken = generateToken({ email, password, expiresIn });

        return generateResponse({
          accessToken,
          tokenType: 'Bearer',
          expiresIn,
          user: {
            email,
            name: 'Test User'
          }
        });
      }

      return generateResponse({}, 401, 'Invalid Credentials!');
    },
    rawResponse: (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  },
  {
    url: '/api/login',
    method: 'options' as MethodType,
    statusCode: 204,
    rawResponse: (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Max-Age', '86400');
      res.end();
    }
  }
];

export default mock;