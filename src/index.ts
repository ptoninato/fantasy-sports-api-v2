import express from 'express';
import dotenv from 'dotenv';
import YahooFantasy from './services/api/YahooFantasyWrapper';
import LeagueRoutes from './routes/league.routes';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.options('*', cors());

app.use('/leagues', LeagueRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/login', (req, res) => {
  YahooFantasy.RedirectToLogin(res);
});

app.get('/auth/callback', async (req, res) => {
  await YahooFantasy.AuthenticateWrapper(req);
  res.redirect('/');
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}`); // eslint-disable-line
});
