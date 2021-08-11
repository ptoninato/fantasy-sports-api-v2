import pool from '../../database/db';
import { GameKeyModel } from '../../Models/GameKeyModel';
import gameApiService from '../api/YahooApi/gameApiService';
import gameCodeTypeDao from '../DataAccess/gameCodeTypeDao';

async function getGameKeyByYahooGameKey(
  yahoo_game_key: string
): Promise<GameKeyModel> {
  console.log(yahoo_game_key);

  const query = `select * from gamekey where yahoogamekey = '${yahoo_game_key}' limit 1`;
  console.log(query);
  const result = await pool.query(query);

  if (result.rowCount == 1) {
    const gamecode = result.rows[0] as GameKeyModel;
    return gamecode;
  }

  return null;
}

async function getOrInsertGameKey(league_key: string): Promise<GameKeyModel> {
  const leagueKeySplit = league_key.split('.');
  const yahooGameKey = leagueKeySplit[0];
  const yahooleagueId = leagueKeySplit[2];

  let gameKey = await getGameKeyByYahooGameKey(yahooGameKey);

  if (gameKey == null) {
    const yahooGameInfo = await gameApiService.getGameMetaDataByGameKey(
      yahooGameKey
    );

    const gameCodeType = await gameCodeTypeDao.getOrInsertGameCodeTypeByLeagueKeyAndGameCode(
      yahooGameInfo.name,
      yahooGameInfo.code
    );

    gameKey = await insertGameCode(
      gameCodeType.gamecodetypeid,
      <number>(<unknown>yahooGameKey),
      <number>(<unknown>yahooGameInfo.season)
    );
  }

  return gameKey;
}

async function insertGameCode(
  gamecodetypeid: number,
  yahoo_game_key: number,
  season_year: number
): Promise<GameKeyModel> {
  console.log('here');

  const query = `insert into gamekey(gamecodetypeid, yahoogamekey, seasonyear) values (${gamecodetypeid}, '${yahoo_game_key}', ${season_year}) RETURNING * `;

  const result = await pool.query(query);

  if (result.rowCount == 1) {
    const gamecode = result.rows[0] as GameKeyModel;
    console.log();
    return gamecode;
  }

  return null;
}

export default { getGameKeyByYahooGameKey, insertGameCode, getOrInsertGameKey };
