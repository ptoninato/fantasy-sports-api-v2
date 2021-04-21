import YahooFantasy from '../YahooFantasyWrapper';

export async function getLeaguesByYahooGameCodes(
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
