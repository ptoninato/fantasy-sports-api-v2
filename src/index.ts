import express from 'express';
import dotenv from 'dotenv';
import YahooFantasy from 'yahoo-fantasy';
import { Response } from 'express-serve-static-core';
import { getUserGames } from './services/YahooApi/yahooUser';

dotenv.config();

const app = express();
const yf = new YahooFantasy(
  `${process.env.YahooClient}`,
  `${process.env.YahooSecret}`,
  '',
  `${process.env.YahooRedirectUri}/auth/callback`
);

function callbackRedirect(res: Response<any, Record<string, any>, number>) {
  res.redirect('/');
}

async function GetLeagues() {
  // promise based
  try {
    const data = await getUserGames(yf);
    console.log(data);
  } catch (e) {
    // handle error
    console.log(e);
  }
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/login', (req, res) => {
  yf.auth(
    res // response object to redirect the user to the Yahoo! login screen
  );
});

app.get('/auth/callback', async (req, res) => {
  await yf.authCallback(
    req, // the request will contain the auth code from Yahoo!
    function test() {
      console.log('logged in');
    } // callback function that will be called after the token has been retrieved
  );
});

app.get('/getleagues', async (req, res) => {
  console.log(typeof yf);
  GetLeagues();
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}`); // eslint-disable-line
});
