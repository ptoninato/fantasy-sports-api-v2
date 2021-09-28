import leagueDao from '../../services/DataAccess/leagueDao';
import seasonDao from '../../services/DataAccess/SeasonDao';
import PlayerDao from '../../services/DataAccess/PlayerDao';
import MatchupTeamDatesDao from '../../services/DataAccess/MatchupTeamDatesDao';
import moment from 'moment';
import rosterApiService from '../../services/api/YahooApi/rosterApiService';
import gameCodeTypeDao from '../../services/DataAccess/gameCodeTypeDao';
import seasonPositionDao from '../../services/DataAccess/seasonPositionDao';
import matchupRosterDao from '../../services/DataAccess/matchupRosterDao';
import matchupTeamDao from '../../services/DataAccess/matchupTeamDao';
import { sleep } from '../../Helpers/Utility/Sleep';
import { LeagueKeyParam } from '../../Types/LeagueKeyParam';
import seasonPositionImporter from './seasonPositionImporter';

async function ImportRosterAllDays(
  leagueKeyParam: LeagueKeyParam
): Promise<void> {
  const results = await MatchupTeamDatesDao.GetMlbRecordsBySeasonYear(
    leagueKeyParam.league_id
  );

  const season = await seasonDao.GetSeasonByYahooLeagueId(
    <number>(<unknown>leagueKeyParam.league_id)
  );
  const gameCodeType = await gameCodeTypeDao.getTypeForSeason(season.seasonid);

  const league = await leagueDao.GetLeagueByLeagueName('The League');
  await seasonPositionImporter.importSeasonPositions(leagueKeyParam);

  let timeoutCount = 0;

  for (let x = 0; x < results.length; x++) {
    const matchupTeam = results[x];

    const matchupStartDate = moment(matchupTeam.startdate);
    const matchupEndDate = moment(matchupTeam.enddate);
    const teamKey = `${matchupTeam.yahoogamekey}.l.${matchupTeam.yahooleagueid}.t.${matchupTeam.yahooteamid}`;

    const matchupTeamModel = await matchupTeamDao.GetMatchupTeamByMatchupTeamId(
      matchupTeam.matchupteamid
    );

    for (
      const m = moment(matchupStartDate);
      m.diff(matchupEndDate, 'days') <= 0;
      m.add(1, 'days')
    ) {
      if (timeoutCount == 190) {
        console.log('waiting');
        await sleep(180000);
        timeoutCount = 0;
      }

      const roster = await rosterApiService.GetRosterForDay(
        matchupTeam.yahooteamid.toString(),
        leagueKeyParam,
        m.format('YYYY-MM-DD')
      );

      timeoutCount++;

      for (let r = 0; r < roster.roster.length; r++) {
        const rosterSpot = roster.roster[r];

        const player = await PlayerDao.GetOrImportPlayerUsingGameCodeTypeAndRoster(
          rosterSpot,
          gameCodeType
        );

        let seasonPosition = await seasonPositionDao.GetSeasonPostion(
          season.seasonid,
          rosterSpot.selected_position
        );

        if (seasonPosition == null) {
          seasonPosition = await seasonPositionImporter.importSeasonPosition(
            leagueKeyParam,
            rosterSpot.selected_position
          );
        }

        const rosterPostion = await matchupRosterDao.GetOrImportMatchupRoster(
          rosterSpot,
          m.format('YYYY-MM-DD'),
          seasonPosition,
          matchupTeamModel,
          player
        );
      }
    }
  }
}
export default { ImportRosterAllDays };
