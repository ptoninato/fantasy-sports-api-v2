import { Request, Response } from 'express';
import LeagueKeyHelper from '../../Helpers/LeagueKeyHelper';
import leagueDao from '../../services/DataAccess/leagueDao';
import seasonDao from '../../services/DataAccess/SeasonDao';
import seasonImporter from '../../services/Importers/seasonImporter';
import fantasyTeamImporter from '../../services/Importers/fantasyTeamImporter';
import transactionImporter from '../../services/Importers/transactionImporter';
import seasonPositionImporter from '../../services/Importers/seasonPositionImporter';
import statCategoryImport from '../../services/Importers/statCategoryImport';
import statCategoryModifierImporter from '../../services/Importers/statCategoryModifierImporter';
import matchupImporter from '../../services/Importers/matchupImporter';
import MatchupRosterStats from '../../services/Importers/MatchupRosterStatsImporter';
import MatchupRosterStatsImporter from '../../services/Importers/MatchupRosterStatsImporter';
import MatchupRosterImporter from '../../services/Importers/MatchupRosterImporter';

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

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  let season = await seasonDao.GetSeasonByYahooLeagueId(
    <number>(<unknown>leagueKeyParam.league_id)
  );

  if (season == null) {
    season = await seasonImporter.importSeason(league_key);
  }

  console.log(season);

  return res.json();
}

export async function ImportTransactions(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await transactionImporter.ImportTransactionsForLeague(leagueKeyParam);

  return res.json();
}

export async function ImportRosterPositions(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await seasonPositionImporter.importSeasonPositions(leagueKeyParam);

  return res.json();
}

export async function ImportStatCategories(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await statCategoryImport.importStatCategory(leagueKeyParam);

  return res.json();
}

export async function ImportStatCategoryModifiers(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await statCategoryModifierImporter.importStatCategoryModifier(leagueKeyParam);

  return res.json();
}

export async function ImportMatchups(
  req: Request,
  res: Response
): Promise<Response> {
  try {
  const league_key = req.query.league_key.toString();

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await fantasyTeamImporter.ImportAllTeamsForLeague(leagueKeyParam);

  await matchupImporter.ImportLeagueMatchupsForEachWeek(leagueKeyParam);
  console.log('Import Complete');
  return res.json();
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
}

export async function ImportMatchupRosterPlayerStatsAll(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await MatchupRosterStatsImporter.ImportRostersAllWeeks(leagueKeyParam);

  return res.json();
}

export async function ImportMatchupRosterPlayerStatsByWeek(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();
  const weekNumber = <number>(<unknown>req.query.weekNumber);

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await MatchupRosterStats.ImportRostersByWeek(leagueKeyParam, weekNumber);

  return res.json();
}

export async function ImportDailyMatchupRosterPlayerStatsForYear(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();
  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await MatchupRosterImporter.ImportRosterAllDays(leagueKeyParam);

  return res.json();
}
