import seasonDao from '../DataAccess/SeasonDao';
import PlayerDao from '../DataAccess/PlayerDao';
import seasonStatCategoryDao from '../DataAccess/seasonStatCategoryDao';
import matchupRosterPlayerStatDao from '../DataAccess/matchupRosterPlayerStatDao';
import gameKeyDao from '../DataAccess/gameKeyDao';
import playerApiService from '../api/YahooApi/playerApiService';
import { LeagueKeyParam } from '../../Types/LeagueKeyParam';
import { sleep } from '../../Helpers/Utility/Sleep';

async function ImportRostersAllWeeks(
  leagueKeyParam: LeagueKeyParam
): Promise<void> {
  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);

  const gameCode = await gameKeyDao.getOrInsertGameKey(
    leagueKeyParam.league_key
  );

  for (let w = 1; w <= season.lastweek; w++) {
    const matchupRosterRecords = await matchupRosterPlayerStatDao.GetRosterPlayerStatsToImportForWeek(
      season.seasonid,
      w
    );

    for (let i = 0; i < matchupRosterRecords.length; i++) {
      const matchupRosterModel = matchupRosterRecords[i];
      const playerModel = await PlayerDao.GetPlayerByPlayerId(
        matchupRosterModel.playerid
      );

      const playerGameKey = `${gameCode.yahoogamekey}.p.${playerModel.yahooplayerid}`;

      const playerWeekStats = await playerApiService.GetPlayerStatsForWeek(
        playerGameKey,
        w
      );
      for (let ps = 0; ps < playerWeekStats.stats.stats.length; ps++) {
        const playerStat = playerWeekStats.stats.stats[ps];

        const seasonStatCategory = await seasonStatCategoryDao.GetStatCategoryForSeason(
          <number>(<unknown>playerStat.stat_id),
          season.seasonid
        );

        if (seasonStatCategory != null) {
          const matchupRosterPlayerStat = await matchupRosterPlayerStatDao.ImportMatchupRosterPlayerStat(
            matchupRosterModel,
            seasonStatCategory,
            playerStat.value
          );
        }
      }
    }
    // console.log('waiting');
    // await sleep(180000);
  }
}

async function ImportRostersByWeek(
  leagueKeyParam: LeagueKeyParam,
  weekNumber: number
): Promise<void> {
  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);

  const gameCode = await gameKeyDao.getOrInsertGameKey(
    leagueKeyParam.league_key
  );

  const matchupRosterRecords = await matchupRosterPlayerStatDao.GetRosterPlayerStatsToImportForWeek(
    season.seasonid,
    weekNumber
  );

  for (let i = 0; i < matchupRosterRecords.length; i++) {
    const matchupRosterModel = matchupRosterRecords[i];
    const playerModel = await PlayerDao.GetPlayerByPlayerId(
      matchupRosterModel.playerid
    );

    const playerGameKey = `${gameCode.yahoogamekey}.p.${playerModel.yahooplayerid}`;

    // const playerWeekStats = await playerApiService.GetPlayerStatsForWeek(
    //   playerGameKey,
    //   weekNumber
    // );

    const playerWeekStats = await matchupRosterPlayerStatDao.GetPlayerStateFromOldDb(weekNumber, season.seasonyear, playerModel.playerid);
    console.log(playerWeekStats);
    // for (let ps = 0; ps < playerWeekStats.stats.stats.length; ps++) {
    //   const playerStat = playerWeekStats.stats.stats[ps];

    //   const seasonStatCategory = await seasonStatCategoryDao.GetStatCategoryForSeason(
    //     <number>(<unknown>playerStat.stat_id),
    //     season.seasonid
    //   );

    //   if (seasonStatCategory != null) {
    //     const matchupRosterPlayerStat = await matchupRosterPlayerStatDao.ImportMatchupRosterPlayerStat(
    //       matchupRosterModel,
    //       seasonStatCategory,
    //       playerStat.value
    //     );
    //   }
    // }
  }
}

export default { ImportRostersByWeek, ImportRostersAllWeeks };
