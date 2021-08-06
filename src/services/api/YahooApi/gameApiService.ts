import YahooFantasy from '../YahooFantasyWrapper';
import { Game } from '../../../Types/Game';

async function getGameMetaDataByGameKey(gameKey: string): Promise<Game> {
  console.log(gameKey);
  const returnedData = await YahooFantasy.yf.game.meta(gameKey);
  //   console.log(typeof returnedData);
  const game = <Game>returnedData;
  console.log(game);
  return game;
}

export default {
  getGameMetaDataByGameKey
};
