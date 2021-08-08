import { QueryResult } from 'pg';
import pool from '../../database/db';
import { GameCodeType } from '../../Models/GameCodeType';

async function getAllCodeTypes(): Promise<GameCodeType[]> {
  try {
    const result = await pool.query('SELECT * FROM gamecodetype');

    const test = result.rows as GameCodeType[];

    return test;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function getCodeTypeByYahooGameCode(
  yahoogamecode: string
): Promise<GameCodeType> {
  try {
    const query = `SELECT * FROM gamecodetype where yahoogamecode = '${yahoogamecode}' limit 1`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const gamecodetype = result.rows[0] as GameCodeType;
      return gamecodetype;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function insertGameCodeType(
  yahoo_game_name: string,
  yahoo_game_code: string
): Promise<GameCodeType> {
  const query = `insert into gamecodetype(yahoogamecode, yahoogamename) values ('${yahoo_game_code}', '${yahoo_game_name}') RETURNING * `;

  const result = await pool.query(query);

  if (result.rowCount == 1) {
    const gamecodetype = result.rows[0] as GameCodeType;
    return gamecodetype;
  }

  return null;
}

export default {
  getAllCodeTypes,
  getCodeTypeByYahooGameCode,
  insertGameCodeType
};
