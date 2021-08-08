import YahooFantasy from '../YahooFantasyWrapper';
import { Game } from '../../../Types/Game';

async function getGameMetaDataByGameKey(gameKey: string): Promise<Game> {
  const returnedData = await YahooFantasy.yf.game.meta(gameKey);
  const game = <Game>returnedData;
  return game;
}

export default {
  getGameMetaDataByGameKey
};
