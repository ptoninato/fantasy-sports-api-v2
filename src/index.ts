import express from 'express';
import dotenv from 'dotenv';
import yahooFantasy from 'yahoo-fantasy';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}`); // eslint-disable-line
});
