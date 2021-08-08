import pool from '../../database/db';
import { SeasonModel } from '../../Models/SeasonModel';

const GetSeasonByYahooLeagueIdAndGameCodeId = async (
  yahooleagueid: number,
  gamecodeid: number
): Promise<SeasonModel> => {
  try {
    const query = `select * from season where gamecodeid = ${gamecodeid} and yahooleagueId = ${yahooleagueid}`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const season = result.rows[0] as SeasonModel;
      return season;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default { GetSeasonByYahooLeagueIdAndGameCodeId };
