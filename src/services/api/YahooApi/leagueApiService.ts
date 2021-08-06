import { League } from '../../../Types/League';
import YahooFantasy from '../YahooFantasyWrapper';

export async function getLeaguesByYahooGameCodes(
  yahooApi: any,
  gameCodes: any
): Promise<string> {
  const returnedData = await YahooFantasy.yf.user.game_leagues(gameCodes);
  return returnedData;
}

export async function getLeagueByYahooGameCode(
  yahooApi: any,
  gameCodes: any
): Promise<string> {
  const returnedData = await YahooFantasy.yf.user.game_leagues(gameCodes);
  return returnedData;
}

export async function getLeagueTeams(
  yahooApi: any,
  leaguekey: any
): Promise<string> {
  const returnData = await YahooFantasy.yf.league.teams(leaguekey);
  return returnData;
}

export async function getLeagueMetaDataByLeagueKey(
  leagueKey: string
): Promise<League> {
  console.log(leagueKey);
  const returnedData = await YahooFantasy.yf.league.meta(leagueKey);
  //   console.log(typeof returnedData);
  const league = <League>returnedData;
  console.log(league);
  return league;
}

export default {
  getLeagueMetaDataByLeagueKey
};
