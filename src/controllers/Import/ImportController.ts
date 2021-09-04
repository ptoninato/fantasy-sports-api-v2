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

  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);

  await fantasyTeamImporter.ImportAllTeamsForLeague(leagueKeyParam);

  for (let i = 1; i <= season.lastweek; i++) {
    const scoreboardForWeek = await scoreboardApiService.GetScoreboardbyLeagueAndWeek(
      leagueKeyParam,
      i
    );

    for (let x = 0; x < scoreboardForWeek.scoreboard.matchups.length; x++) {
      const matchup = scoreboardForWeek.scoreboard.matchups[x];

      const seasonWeek = await SeasonWeekDao.GetOrImportSeasonWeek(
        matchup,
        season
      );
      const isTied = matchup.is_tied === 1;

      let team1;
      let team2;

      if (isTied) {
        const firstTeam = matchup.teams[0];
        const secondTeam = matchup.teams[1];
        team1 = matchup.teams.filter(
          (value) => value.team_key === firstTeam.team_key
        )[0] as Team;
        team2 = matchup.teams.filter(
          (value) => value.team_key === secondTeam.team_key
        )[0] as Team;
      } else {
        const team1Key = matchup.winner_team_key;
        team1 = matchup.teams.filter(
          (value) => value.team_key === team1Key
        )[0] as Team;
        team2 = matchup.teams.filter(
          (value) => value.team_key !== team1Key
        )[0] as Team;
      }

      team1 = team1 as Team;
      team2 = team2 as Team;

      const dbTeam1 = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
        season.seasonid,
        team1.team_id
      );

      const dbTeam2 = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
        season.seasonid,
        team2.team_id
      );

      const winningTeamId = isTied ? null : dbTeam1.fantasyteamid;
      const losingTeamId = isTied ? null : dbTeam2.fantasyteamid;

      const matchupForDb = {} as MatchupModel;

      matchupForDb.fantasyteamid1 = dbTeam1.fantasyteamid;
      matchupForDb.fantasyteamid2 = dbTeam2.fantasyteamid;
      matchupForDb.winningteamid = winningTeamId;
      matchupForDb.losingteamid = losingTeamId;
      matchupForDb.isplayoffs = matchup.is_playoffs === '1';
      matchupForDb.isconsolation = matchup.is_consolation === '1';
      matchupForDb.seasonid = season.seasonid;

      if (matchup.matchup_recap_title != null) {
        matchupForDb.matchuprecaptitle = matchup.matchup_recap_title.replace(
          /'/g,
          "''"
        );
      }

      matchupForDb.matchuprecap = matchup.matchup_recap_url;
      matchupForDb.seasonweekid = seasonWeek.seasonweekid;
      matchupForDb.tie = isTied;

      const matchupResult = await matchupDao.GetOrImportMatchup(matchupForDb);

      console.log(matchupResult);
    }
  }
  return res.json();
}
