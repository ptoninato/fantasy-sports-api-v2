import YahooFantasy from 'yahoo-fantasy';
import { Response, Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const yf = new YahooFantasy(
  `${process.env.YahooClient}`,
  `${process.env.YahooSecret}`,
  '',
  `${process.env.YahooRedirectUri}/auth/callback`
);

export async function RedirectToLogin(response: Response): Promise<void> {
  yf.auth(
    response // response object to redirect the user to the Yahoo! login screen
  );
}

export async function AuthenticateWrapper(request: Request): Promise<void> {
  await yf.authCallback(
    request, // the request will contain the auth code from Yahoo!
    function test() {
      console.log('logged in');
    } // callback function that will be called after the token has been retrieved
  );
}

export default {
  yf,
  RedirectToLogin,
  AuthenticateWrapper
};
