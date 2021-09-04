import YahooFantasy from '../YahooFantasyWrapper';
import { LeagueKeyParam } from '../../../Types/LeagueKeyParam';
import { ScoreboardRootObject } from '../../../Types/Scoreboard';

async function GetScoreboardbyLeagueAndWeek(
  leagueKeyParam: LeagueKeyParam,
  week: number
): Promise<ScoreboardRootObject> {
  const returnedData = await YahooFantasy.yf.league.scoreboard(
    leagueKeyParam.league_key,
    week
  );
  const Scoreboard = <ScoreboardRootObject>returnedData;
  return Scoreboard;
}

export default {
  GetScoreboardbyLeagueAndWeek
};
