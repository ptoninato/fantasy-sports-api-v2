import { Request, Response } from 'express';
import leagueImporter from '../../services/Importers/leagueImporter';
import leagueSettingsApiService from '../../services/api/YahooApi/leagueSettingsApiService';
import leagueDao from '../../services/DataAccess/leagueDao';
import SeasonDao from '../../services/DataAccess/SeasonDao';
import leagueApiService from '../../services/api/YahooApi/leagueApiService';

export async function ImportLeague(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();
  const leagueKeySplit = league_key.split('.');
  const gamecode = leagueKeySplit[0];
  const yahooleagueId = leagueKeySplit[2];

  const league = await leagueDao.GetOrImportLeague(league_key);

  console.log(league);

  return res.json();
}

export async function ImportSeason(
  req: Request,
  res: Response
): Promise<Response> {
  console.log('here');

  const league_key = req.query.league_key.toString();
  const leagueKeySplit = league_key.split('.');
  const gamecode = leagueKeySplit[0];
  const yahooleagueId = leagueKeySplit[2];

  const league = await leagueDao.GetOrImportLeague(league_key);

  const season = await SeasonDao.GetSeasonByYahooLeagueId(
    <number>(<unknown>yahooleagueId)
  );

  console.log(league);
  console.log(season);

  return res.json();
}
