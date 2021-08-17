import { TeamKeyParam } from '../Types/TeamKeyParam';

async function SplitTeamKey(teamKey: string): Promise<TeamKeyParam> {
  const teamKeySplit = teamKey.split('.');
  const yahooGameKey = teamKeySplit[0];
  const yahooleagueId = teamKeySplit[2];
  const yahooTeamKey = teamKeySplit[4];

  const TeamKeyParam = {} as TeamKeyParam;

  TeamKeyParam.game_code = yahooGameKey;
  TeamKeyParam.league_id = yahooleagueId;
  TeamKeyParam.league_key = teamKey;
  TeamKeyParam.team_key = yahooTeamKey;

  return TeamKeyParam;
}

export default {
  SplitTeamKey
};
