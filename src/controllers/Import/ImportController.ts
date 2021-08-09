import { Request, Response } from 'express';
import leagueImporter from '../../services/Importers/leagueImporter';
import leagueSettingsApiService from '../../services/api/YahooApi/leagueSettingsApiService';
import leagueDao from '../../services/DataAccess/leagueDao';

export async function ImportLeague(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  // const league = await leagueImporter
  //   .importLeague(league_key)
  //   .catch((error) => {
  //     console.log(error);
  //   });

  const leagueSettings = await leagueSettingsApiService.getLeagueSettingsByLeagueKey(
    league_key
  );

  const league = await leagueDao.GetLeagueByLeagueName(leagueSettings.name);

  //do gamecode

  //do seasson

  return res.json();
}
