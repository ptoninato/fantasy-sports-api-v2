import { UserGames, Code } from '../../../Types/UserGames';
import YahooApi from '../YahooFantasyWrapper';

export async function getUserGames(): Promise<any[]> {
  const returnedData = await YahooApi.yf.user.games();

  const userGame = returnedData as UserGames;

  const codes = await userGame.games.reduce(
    (data: any[], game: { code: string }) => {
      if (game.code === Code.Mlb || game.code === Code.Nfl) {
        data.push(game);
      }
      return data;
    },
    []
  );

  return codes;
}

async function getUserGameLeaguesByGameKeys(
  gameKeys: string[]
): Promise<UserGames> {
  const returnedData = (await YahooApi.yf.user.game_leagues(
    gameKeys
  )) as UserGames;

  return returnedData;
}

export default {
  getUserGames,
  getUserGameLeaguesByGameKeys
};
