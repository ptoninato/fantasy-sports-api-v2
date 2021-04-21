import gameKeyService from '../services/api/gameKeyService';
import yahooUser from '../services/api/YahooApi/userApiService';
import { Request, Response } from 'express';
import YahooFantasy from '../services/api/YahooFantasyWrapper';

export async function getLeagues(
  req: Request,
  res: Response
): Promise<Response> {
  console.log('here');
  const game_keys = await gameKeyService.getGameKeysForUser(YahooFantasy.yf);
  const userLeagues = await yahooUser.getUserGameLeaguesByGameKeys(
    YahooFantasy.yf,
    game_keys
  );

  return res.json(userLeagues);
}
