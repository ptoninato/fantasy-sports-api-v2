import gameKeyService from '../services/api/gameKeyService';
import yahooUser from '../services/api/YahooApi/userApiService';
import { Request, Response } from 'express';

export async function getLeagues(
  req: Request,
  res: Response
): Promise<Response> {
  console.log('here');
  const game_keys = await gameKeyService.getGameKeysForUser();
  const userLeagues = await yahooUser.getUserGameLeaguesByGameKeys(game_keys);

  return res.json(userLeagues);
}
