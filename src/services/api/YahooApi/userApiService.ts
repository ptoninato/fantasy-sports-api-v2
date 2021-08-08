import { UserGames } from '../../../Types/UserGames';
import { Game } from '../../../Types/Game';
import { Code } from '../../../Types/Enums';
import YahooApi from '../YahooFantasyWrapper';

export async function getUserGames(): Promise<Game[]> {
  const returnedData = await YahooApi.yf.user.games();

  const userGame = returnedData as UserGames;

  const games = userGame.games as Game[];

  const codes = games.reduce((data: Game[], game: { code: string }) => {
    if (game.code === Code.Mlb || game.code === Code.Nfl) {
      const gameType = game as Game;

      data.push(gameType);
    }
    return data;
  }, []);
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
