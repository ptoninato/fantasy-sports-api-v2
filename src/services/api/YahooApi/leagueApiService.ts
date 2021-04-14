export async function getLeaguesByYahooGameCodes(
  yahooApi: any,
  gameCodes: any
): Promise<string> {
  const returnedData = await yahooApi.user.game_leagues(gameCodes);
  return returnedData;
}

export async function getLeagueTeams(
  yahooApi: any,
  leaguekey: any
): Promise<string> {
  const returnData = await yahooApi.league.teams(leaguekey);
  return returnData;
}
