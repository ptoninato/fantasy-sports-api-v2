import express from 'express';
import dotenv from 'dotenv';
import YahooFantasy from 'yahoo-fantasy';
import { Response } from 'express-serve-static-core';
import yahooUser from './services/api/YahooApi/userApiService';
import gameKeyService from './services/api/gameKeyService';
import leagueRoutes from './routes/LeagueRoutes';

dotenv.config();

const app = express();
const yf = new YahooFantasy(
  `${process.env.YahooClient}`,
  `${process.env.YahooSecret}`,
  '',
  `${process.env.YahooRedirectUri}/auth/callback`
);

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
  res.redirect('/');
});

app.get('/getleagues', async (req, res) => {
  const game_keys = await gameKeyService.getGameKeysForUser(yf);

  const userLeagues = await yahooUser.getUserGameLeaguesByGameKeys(
    yf,
    game_keys
  );

  res.json(userLeagues);
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}`); // eslint-disable-line
});
