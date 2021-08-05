import YahooFantasy from '../YahooFantasyWrapper';

async function getMetaDataByLeagueKey(leagueKey: string): Promise<string> {
  console.log(leagueKey);
  const returnedData = await YahooFantasy.yf.league.meta(leagueKey);
  return returnedData;
}

export default {
  getMetaDataByLeagueKey
};
