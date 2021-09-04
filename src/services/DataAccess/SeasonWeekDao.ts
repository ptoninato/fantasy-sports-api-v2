import pool from '../../database/db';
import { SeasonModel } from '../../Models/SeasonModel';
import { SeasonWeekModel } from '../../Models/SeasonWeekModel';
import { Matchup } from '../../Types/Matchup';

async function GetOrImportSeasonWeek(
  matchup: Matchup,
  season: SeasonModel
): Promise<SeasonWeekModel> {
  let query = `select * from seasonweek where seasonid = '${season.seasonid}' and weeknumber = ${matchup.week} limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    const isPlayoffs = matchup.is_playoffs != '0';

    query = `INSERT INTO seasonweek(seasonid, weeknumber, startdate, enddate, ispostseason) VALUES(${season.seasonid}, ${matchup.week}, '${matchup.week_start}', '${matchup.week_end}', ${isPlayoffs}) RETURNING *`;

    result = await pool.query(query);
  }

  const SeasonWeekModel = result.rows[0] as SeasonWeekModel;

  return SeasonWeekModel;
}

export default {
  GetOrImportSeasonWeek
};
