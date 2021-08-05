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

export default { getAllCodeTypes };
