import { Request, Response } from 'express';
import leagueApi from '../../services/api/YahooApi/leagueApiService';
import gameApi from '../../services/api/YahooApi/gameApiService';
import gameCodeTypeDao from '../../services/DataAccess/gameCodeTypeDao';
import leagueDao from '../../services/DataAccess/leagueDao';

export async function ImportLeague(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const leagueMetadata = await leagueApi.getLeagueMetaDataByLeagueKey(
    league_key
  );

  const gameCodeType = await gameCodeTypeDao.getCodeTypeByYahooGameCode(
    leagueMetadata.game_code
  );

  if (gameCodeType == null) {
    const league_KeySplit = league_key.split('.');

    const yahooGameInfo = await gameApi.getGameMetaDataByGameKey(
      league_KeySplit[0]
    );

    const gameCodeType = await gameCodeTypeDao.insertGameCodeType(
      yahooGameInfo.name,
      yahooGameInfo.code
    );

    console.log(gameCodeType);
  }
  const existingLeauge = await leagueDao.GetLeagueByLeagueName(
    leagueMetadata.name
  );

  // if (existingLeauge == null) {
  // }

  return res.json();
}
