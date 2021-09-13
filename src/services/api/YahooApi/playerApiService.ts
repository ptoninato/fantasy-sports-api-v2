import YahooFantasy from '../YahooFantasyWrapper';
import { PlayerStats } from '../../../Types/PlayerStats';

async function GetPlayerStatsForWeek(
  playerKey: string,
  week: number
): Promise<PlayerStats> {
  const returnedData = await YahooFantasy.yf.player.stats(playerKey, week);
  const playerStats = <PlayerStats>returnedData;
  return playerStats;
}

export default {
  GetPlayerStatsForWeek
};
