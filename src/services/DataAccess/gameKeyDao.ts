import pool from '../../database/db';
import { GameCodeModel } from '../../Models/GameCodeModel';

async function getGameKeyByYahooGameKey(
  yahoo_game_key: number
): Promise<GameCodeModel> {
  const query = `select * from gamekey where yahoogamekey = ${yahoo_game_key} limit 1`;

  const result = await pool.query(query);

  if (result.rowCount == 1) {
    const gamecode = result.rows[0] as GameCodeModel;
    return gamecode;
  }

  return null;
}

async function insertGameCode(
  gamecodetypeid: number,
  yahoo_game_key: number,
  season_year: number
): Promise<GameCodeModel> {
  const query = `insert into gamekey(gamecodetypeid, yahoogamekey, seasonyear) values (${gamecodetypeid}, ${yahoo_game_key}, ${season_year}) RETURNING * `;

  const result = await pool.query(query);

  if (result.rowCount == 1) {
    const gamecode = result.rows[0] as GameCodeModel;
    return gamecode;
  }

  return null;
}

export default { getGameKeyByYahooGameKey, insertGameCode };
