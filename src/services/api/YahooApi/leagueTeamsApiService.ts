import { LeagueKeyParam } from '../../../Types/LeagueKeyParam';
import { LeagueTeamsRootObject } from '../../../Types/LeagueTeams';
import YahooFantasy from '../YahooFantasyWrapper';

export async function GetLeagueTeamsByLeagueKey(
  league_key: LeagueKeyParam
): Promise<LeagueTeamsRootObject> {
  const returnedData = await YahooFantasy.yf.league.teams(
    league_key.league_key
  );
  const transactions = <LeagueTeamsRootObject>returnedData;

  return transactions;
}

export default {
  GetLeagueTeamsByLeagueKey
};
