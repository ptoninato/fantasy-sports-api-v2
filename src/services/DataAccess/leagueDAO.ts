import pool from '../../database/db';
import { LeagueModel } from '../../Models/LeagueModel';

const GetLeagueRecords = async () => {
  try {
    const result = await pool.query('SELECT * FROM league');

    if (result.rowCount == 1) {
      const gamecodetype = result.rows as LeagueModel[];
      return gamecodetype;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetLeagueByLeagueName = async (
  leaguename: string
): Promise<LeagueModel> => {
  try {
    const query = `select * from league where leaguename = '${leaguename}' limit 1`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const gamecodetype = result.rows[0] as LeagueModel;
      return gamecodetype;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default { GetLeagueRecords, GetLeagueByLeagueName };
