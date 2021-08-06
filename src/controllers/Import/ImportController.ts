import { Request, Response } from 'express';
import leagueApi from '../../services/api/YahooApi/leagueApiService';
import gameApi from '../../services/api/YahooApi/gameApiService';
import { League } from '../../Types/UserGames';

export async function ImportLeague(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const leagueMetaDataRaw = await leagueApi.getLeagueMetaDataByLeagueKey(
    league_key
  );

  console.log(leagueMetaDataRaw.game_code);

  const splitLeagueCode = league_key.split('.');

  const gameMetaData = await gameApi.getGameMetaDataByGameKey(
    splitLeagueCode[0]
  );

  return res.json();
}
