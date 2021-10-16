import pool from '../../database/db';
import { YahooTeamKeysModel } from '../../Models/YahooTeamKeysModel';

const GetFantasyTeamId = async (teamKey: string): Promise<number> => {
  try {
    const query = `select * from yahooteamkeys y where team_key = '${teamKey} `;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const team = result.rows[0] as YahooTeamKeysModel;
      return team.fantasyteamid;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default { GetFantasyTeamId };
