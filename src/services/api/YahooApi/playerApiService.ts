import YahooFantasy from '../YahooFantasyWrapper';
import { PlayerStats } from '../../../Types/PlayerStats';

async function GetPlayerStatsForWeek(
  playerKey: string,
  week: number
): Promise<PlayerStats> {
  const weekString = <string>(<unknown>week);
  console.log(playerKey, weekString);
  const returnedData = await YahooFantasy.yf.player.stats(
    playerKey,
    weekString.toString()
  );
  const playerStats = <PlayerStats>returnedData;
  return playerStats;
}

export default {
  GetPlayerStatsForWeek
};
