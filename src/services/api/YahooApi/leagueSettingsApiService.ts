import YahooFantasy from '../YahooFantasyWrapper';
import { LeagueSettingsRootObject } from '../../../Types/LeagueSettings';

export async function getLeagueSettingsByLeagueKey(
  league_key: string
): Promise<LeagueSettingsRootObject> {
  const returnedData = await YahooFantasy.yf.league.settings(league_key);
  const leagueSettings = <LeagueSettingsRootObject>returnedData;
  console.log(leagueSettings.settings.stat_modifiers.stats[0].stat);

  return leagueSettings;
}

export default { getLeagueSettingsByLeagueKey };
