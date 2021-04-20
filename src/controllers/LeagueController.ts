import gameKeyService from '../services/api/gameKeyService';
import yahooUser from '../services/api/YahooApi/userApiService';
import { Request, Response } from 'express';

export async function getLeagues(
  req: Request,
  res: Response,
  yf: any
): Promise<Response> {
  const game_keys = await gameKeyService.getGameKeysForUser(yf);
  const userLeagues = await yahooUser.getUserGameLeaguesByGameKeys(
    yf,
    game_keys
  );

  return res.json(userLeagues);
}
