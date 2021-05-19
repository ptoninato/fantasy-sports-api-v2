import pool from '../../database/db';

const GetLeagueRecords = async () => {
  try {
    return await pool.query('SELECT * FROM league');
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default { GetLeagueRecords };
