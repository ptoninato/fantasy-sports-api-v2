import gameKeyService from '../services/api/gameKeyService';
import yahooUser from '../services/api/YahooApi/userApiService';
import gameCodeTypeDAO from '../services/DataAccess/gameCodeTypeDao';

import { Request, Response } from 'express';

export async function getLeagues(
  req: Request,
  res: Response
): Promise<Response> {
  const game_keys = await gameKeyService.getGameKeysForUser();
  const userLeagues = await yahooUser.getUserGameLeaguesByGameKeys(game_keys);

  return res.json(userLeagues);
}

export async function getGameCodeTypes(
  req: Request,
  res: Response
): Promise<Response> {
  const result = await gameCodeTypeDAO.getAllCodeTypes();

  return res.json(result);
}
