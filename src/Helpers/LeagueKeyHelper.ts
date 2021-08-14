import { LeagueKeyParam } from '../Types/LeagueKeyParam';

async function SplitLeagueKey(leagueKey: string): Promise<LeagueKeyParam> {
  const leagueKeySplit = leagueKey.split('.');
  const yahooGameKey = leagueKeySplit[0];
  const yahooleagueId = leagueKeySplit[2];

  const leagueKeyParam = {} as LeagueKeyParam;

  leagueKeyParam.game_code = yahooGameKey;
  leagueKeyParam.league_id = yahooleagueId;
  leagueKeyParam.league_key = leagueKey;

  return leagueKeyParam;
}

export default {
  SplitLeagueKey
};
