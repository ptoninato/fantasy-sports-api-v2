import { FantasyTeamModel } from '../../Models/FantasyTeamModel';
import { LeagueKeyParam } from '../../Types/LeagueKeyParam';
import gameApiService from '../api/YahooApi/gameApiService';
import leagueApiService from '../api/YahooApi/leagueApiService';
import leagueTeamsApiService from '../api/YahooApi/leagueTeamsApiService';
import fantasyTeamDao from '../DataAccess/fantasyTeamDao';
import leagueDao from '../DataAccess/leagueDao';
import ownerDao from '../DataAccess/ownerDao';
import SeasonDao from '../DataAccess/SeasonDao';

async function ImportAllTeamsForLeague(
  leagueKeyParam: LeagueKeyParam
): Promise<void> {
  const league = await leagueDao.GetOrImportLeague(leagueKeyParam.league_key);

  const season = await SeasonDao.GetOrImportSeason(leagueKeyParam);

  const teams = await leagueTeamsApiService.GetLeagueTeamsByLeagueKey(
    leagueKeyParam
  );
  if (season != null && season != undefined) {
    for (let i = 0; i < teams.teams.length; i++) {
      const team = teams.teams[i];
      const teamOwnerFromYahoo = team.managers[0];

      const teamOwnerFromDb = await ownerDao.GetOrImportOwner(
        teamOwnerFromYahoo,
        league
      );

      const fantasyTeam = await fantasyTeamDao.GetOrImportFantasyTeam(
        teamOwnerFromDb,
        league,
        season,
        team
      );
    }
  }
}

export default { ImportAllTeamsForLeague };
