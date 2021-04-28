import { getUserGames } from './YahooApi/userApiService';

async function getGameKeysForUser(): Promise<string[]> {
  const data = await getUserGames();
  const game_keys = [];
  for (const key in data) {
    const record = data[key];
    const game_key = record['game_key'];
    console.log(game_key);
    game_keys.push(game_key);
  }

  return game_keys;
}

export default {
  getGameKeysForUser
};
