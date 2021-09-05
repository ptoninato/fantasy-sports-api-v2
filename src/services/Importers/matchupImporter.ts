import seasonDao from '../../services/DataAccess/SeasonDao';
import fantasyTeamDao from '../../services/DataAccess/fantasyTeamDao';
import fantasyTeamImporter from '../../services/Importers/fantasyTeamImporter';
import scoreboardApiService from '../../services/api/YahooApi/scoreboardApiService';
import SeasonWeekDao from '../../services/DataAccess/SeasonWeekDao';
import { MatchupGrade, Team } from '../../Types/Scoreboard';
import { MatchupModel } from '../../Models/MatchupModel';
import matchupDao from '../../services/DataAccess/matchupDao';
import { LeagueKeyParam } from '../../Types/LeagueKeyParam';
import { Matchup } from '../../Types/Matchup';
import { SeasonModel } from '../../Models/SeasonModel';
import { SeasonWeekModel } from '../../Models/SeasonWeekModel';
import matchupGradeTypeDao from '../DataAccess/matchupGradeTypeDao';
import { MatchupTeamModel } from '../../Models/MatchupTeamModel';
import matchupTeamDao from '../DataAccess/matchupTeamDao';
import matchupTeamImporter from './matchupTeamImporter';
import seasonStatCategoryDao from '../DataAccess/seasonStatCategoryDao';
import statCategoryImport from './statCategoryImport';
import statCategoryModifierImporter from './statCategoryModifierImporter';
import matchupStatCategoryDao from '../DataAccess/matchupStatCategoryDao';
import gameCodeTypeDao from '../DataAccess/gameCodeTypeDao';
import rosterApiService from '../api/YahooApi/rosterApiService';
import PlayerDao from '../DataAccess/PlayerDao';

async function ImportMatchup(
  matchup: Matchup,
  season: SeasonModel,
  seasonWeek: SeasonWeekModel
): Promise<MatchupModel> {
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
  } else {
    matchupForDb.matchuprecaptitle = null;
  }

  matchupForDb.matchuprecap = matchup.matchup_recap_url ?? null;
  matchupForDb.seasonweekid = seasonWeek.seasonweekid;
  matchupForDb.tie = isTied;

  const matchupResult = await matchupDao.GetOrImportMatchup(matchupForDb);

  return matchupResult;
}

async function ImportLeagueMatchupsForEachWeek(
  leagueKeyParam: LeagueKeyParam
): Promise<void> {
  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);
  const gameCodeType = await gameCodeTypeDao.getTypeForSeason(season.seasonid);
  await statCategoryImport.importStatCategory(leagueKeyParam);

  await statCategoryModifierImporter.importStatCategoryModifier(leagueKeyParam);

  for (let i = 1; i <= season.lastweek; i++) {
    const scoreboardForWeek = await scoreboardApiService.GetScoreboardbyLeagueAndWeek(
      leagueKeyParam,
      i
    );

    for (let x = 0; x < scoreboardForWeek.scoreboard.matchups.length; x++) {
      const matchupFromYahoo = scoreboardForWeek.scoreboard.matchups[x];
      const seasonWeek = await SeasonWeekDao.GetOrImportSeasonWeek(
        matchupFromYahoo,
        season
      );

      const matchupModel = await ImportMatchup(
        matchupFromYahoo,
        season,
        seasonWeek
      );

      for (let y = 0; y < matchupFromYahoo.teams.length; y++) {
        const team = matchupFromYahoo.teams[y] as Team;

        const matchupTeam = await matchupTeamImporter.ImportMatchupTeam(
          team,
          matchupFromYahoo,
          season,
          matchupModel
        );

        for (let s = 0; s < team.stats?.length; s++) {
          const stat = team.stats[s];

          const statCategory = await seasonStatCategoryDao.GetStatCategoryForSeason(
            <number>(<unknown>stat.stat_id),
            season.seasonid
          );

          await matchupStatCategoryDao.GetOrImportMatchupStatCategory(
            stat,
            statCategory,
            matchupTeam
          );
        }

        if (gameCodeType.yahoogamecode.toLowerCase() === 'nfl') {
          const roster = await rosterApiService.GetRosterForMatchupWeek(
            team.team_id,
            leagueKeyParam,
            i
          );
          for (let r = 0; r < roster.roster.length; r++) {
            const rosterSpot = roster.roster[r];
            const player = await PlayerDao.GetOrImportPlayerUsingGameCodeTypeAndRoster(
              rosterSpot,
              gameCodeType
            );
          }
          //   for (let r = 0; r < roster.length; r++) {
          //     const rosterSpot = roster[r];
          //     // console.log(`${rosterSpot.player_id}/${yahooTeamCodeFromDb.gamecodetypeid}`);
          //     const playersFromDb = players.rows.filter(
          //       (value) =>
          //         value.yahooplayerid === Number(rosterSpot.player_id) &&
          //         value.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid
          //     );
          //     let player;
          //     if (playersFromDb.length === 0) {
          //       await ImportPlayerTypeAndPlayer(
          //         req,
          //         res,
          //         rosterSpot,
          //         yahooTeamCodeFromDb
          //       );
          //       player = await players.rows.filter(
          //         (value) =>
          //           value.yahooplayerid === Number(rosterSpot.player_id) &&
          //           value.gamecodetypeid === yahooTeamCodeFromDb.gamecodetypeid
          //       )[0];
          //     } else {
          //       player = playersFromDb[0];
          //     }
          //     const existingMatchupRoster = existingMatchupRosters.rows.filter(
          //       (value) =>
          //         value.matchupteamid === yahooTeamCodeFromDb.matchupteamid &&
          //         value.playerid === player.playerid
          //     );
          //     if (existingMatchupRoster.length === 0) {
          //       const position = seasonPositions.rows.filter(
          //         (value) =>
          //           value.positionname === rosterSpot.selected_position &&
          //           value.seasonid === season.seasonid
          //       )[0];
          //       const matchuproster = [
          //         yahooTeamCodeFromDb.matchupteamid,
          //         player.playerid,
          //         gamedate,
          //         position.seasonpositionid
          //       ];
          //       console.log(
          //         `Adding Roster Spot for ${player.firstname}, ${player.lastname}, ${position.positioname}, ${yahooTeamCodeFromDb.matchupteamid},  ${season.seasonyear}`
          //       );
          //       const query =
          //         'INSERT INTO matchuproster(matchupteamid, playerid, gamedate, seasonpositionid) VALUES($1, $2, $3, $4)';
          //       const results = await pool.query(query, matchuproster);
          //     }
          //   }
        }
      }

      await matchupTeamImporter.ImportMatchupTeamTies(
        matchupModel,
        matchupFromYahoo
      );
    }
  }
}

export default { ImportLeagueMatchupsForEachWeek };
