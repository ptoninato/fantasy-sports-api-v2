import { Request, Response } from 'express';
import gameApi from '../../services/api/YahooApi/gameApiService';

export async function ImportLeague(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const leagueMetaData = await gameApi.getMetaDataByLeagueKey(league_key);
  console.log(leagueMetaData);
  return res.json();
}
