import { Request, Response } from 'express';
import leagueDao from '../../services/DataAccess/leagueDao';
import seasonDao from '../../services/DataAccess/SeasonDao';
import seasonImporter from '../../services/Importers/seasonImporter';

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
  const yahooGameKey = leagueKeySplit[0];
  const yahooleagueId = leagueKeySplit[2];

  let season = await seasonDao.GetSeasonByYahooLeagueId(
    <number>(<unknown>yahooleagueId)
  );

  if (season == null) {
    season = await seasonImporter.importSeason(league_key);
  }

  console.log(season);

  return res.json();
}
