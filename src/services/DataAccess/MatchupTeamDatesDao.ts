import pool from '../../database/db';
import { YahooLeagueAndTeamCodesModel } from '../../Models/MatchupTeamDatesDao';

async function GetMlbRecordsBySeasonYear(
  yahooleagueid: string
): Promise<YahooLeagueAndTeamCodesModel[]> {
  const query = `select * from matchupteamdates m where yahooleagueid = ${yahooleagueid}`;

  const result = await pool.query(query);

  const records = result.rows as YahooLeagueAndTeamCodesModel[];

  return records;
}

export default {
  GetMlbRecordsBySeasonYear
};
