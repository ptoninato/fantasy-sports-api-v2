import express from 'express';
import dotenv from 'dotenv';
import YahooFantasy from 'yahoo-fantasy';
import { Response } from 'express-serve-static-core';

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
    const players = await yf.user.games();
    return players;
  } catch (e) {
    // handle error
    console.log(e);
  }
}

app.get('/', (req, res) => {
  yf.auth(
    res // response object to redirect the user to the Yahoo! login screen
  );
  res.send('Hello World!');
});

app.get('/login', (req, res) => {
  yf.auth(
    res // response object to redirect the user to the Yahoo! login screen
  );
});

app.get('/auth/callback', async (req, res) => {
  await yf.authCallback(req, function callbackRedirect() {
    console.log('here');
  }); // the request will contain the auth code from Yahoo!
  res.redirect('/');
});

app.get('/getLeagues', async (req, res) => {
  const result = await GetLeagues();
  console.log(result);
  res.json(result);
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}`); // eslint-disable-line
});
