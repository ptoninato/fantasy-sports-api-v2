import { Request, Response } from 'express';
import LeagueKeyHelper from '../../Helpers/LeagueKeyHelper';
import leagueDao from '../../services/DataAccess/leagueDao';
import SeasonDao from '../../services/DataAccess/SeasonDao';
import seasonDao from '../../services/DataAccess/SeasonDao';
import seasonImporter from '../../services/Importers/seasonImporter';
import transactionApiSerivce from '../../services/api/YahooApi/transactionApiService';
import leagueTeamApiService from '../../services/api/YahooApi/leagueTeamsApiService';
import ownerDao from '../../services/DataAccess/ownerDao';
import fantasyTeamDao from '../../services/DataAccess/fantasyTeamDao';
import leagueTeamsApiService from '../../services/api/YahooApi/leagueTeamsApiService';
import PlayerDao from '../../services/DataAccess/PlayerDao';
import transactionTypeDao from '../../services/DataAccess/transactionTypeDao';
import fantasyTeamImporter from '../../services/Importers/fantasyTeamImporter';
import transactionDao from '../../services/DataAccess/transactionDao';
import TreamKeyHelper from '../../Helpers/TeamKeyHelper';
import TeamKeyHelper from '../../Helpers/TeamKeyHelper';
import transactionImporter from '../../services/Importers/transactionImporter';
import rosterPostionDao from '../../services/DataAccess/rosterPostionDao';
import seasonPositionImporter from '../../services/Importers/seasonPositionImporter';
import leagueSettingsApiService from '../../services/api/YahooApi/leagueSettingsApiService';
import statCategoryTypeDao from '../../services/DataAccess/seasonStatCategoryTypeDao';
import positionTypeDao from '../../services/DataAccess/positionTypeDao';
import seasonStatCategoryDao from '../../services/DataAccess/seasonStatCategoryDao';
import statCategoryImport from '../../services/Importers/statCategoryImport';
import leagueApiService from '../../services/api/YahooApi/leagueApiService';
import seasonStatCategoryTypeDao from '../../services/DataAccess/seasonStatCategoryTypeDao';
import seasonStatModiferDao from '../../services/DataAccess/seasonStatModiferDao';
import statCategoryModifierImporter from '../../services/Importers/statCategoryModifierImporter';
import scoreboardApiService from '../../services/api/YahooApi/scoreboardApiService';
import SeasonWeekDao from '../../services/DataAccess/SeasonWeekDao';
import { Team } from '../../Types/Scoreboard';
import { MatchupModel } from '../../Models/MatchupModel';
import matchupDao from '../../services/DataAccess/matchupDao';
import matchupImporter from '../../services/Importers/matchupImporter';

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
  const league_key = req.query.league_key.toString();

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await fantasyTeamImporter.ImportAllTeamsForLeague(leagueKeyParam);

  await matchupImporter.ImportLeagueMatchupsForEachWeek(leagueKeyParam);
  console.log('Import Complete');
  return res.json();
}
