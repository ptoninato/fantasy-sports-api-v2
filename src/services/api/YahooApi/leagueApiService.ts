import { League } from '../../../Types/League';
import YahooFantasy from '../YahooFantasyWrapper';

export async function getLeaguesByYahooGameCodes(
  gameCodes: string
): Promise<string> {
  const returnedData = await YahooFantasy.yf.user.game_leagues(gameCodes);
  return returnedData;
}

export async function getLeagueByYahooGameCode(
  gameCodes: string
): Promise<string> {
  const returnedData = await YahooFantasy.yf.user.game_leagues(gameCodes);
  return returnedData;
}

export async function getLeagueTeams(leaguekey: string): Promise<string> {
  const returnData = await YahooFantasy.yf.league.teams(leaguekey);
  return returnData;
}

export async function getLeagueMetaDataByLeagueKey(
  leagueKey: string
): Promise<League> {
  const returnedData = await YahooFantasy.yf.league.meta(leagueKey);
  const league = <League>returnedData;
  return league;
}

export default {
  getLeagueMetaDataByLeagueKey
};
