import pool from '../../database/db';
import { MatchupRosterModel } from '../../Models/MatchupRosterModel';
import { MatchupRosterPlayerStatModel } from '../../Models/MatchupRosterPlayerStatModel';
import { SeasonStatCategoryModel } from '../../Models/StatCategoryModel';

async function GetRosterPlayerStatsToImportForWeek(
  seasonId: number,
  weekNumber: number
): Promise<MatchupRosterModel[]> {
  const query = `select m2.* from matchuproster m2
join matchupteam m on m2.matchupteamid = m.matchupteamid 
join matchup m3 on m.matchupid = m3.matchupid 
join season s on m3.seasonid = s.seasonid 
join league l on s.leagueid = l.leagueid
join gamecodetype g on l.gamecodetypeid = g.gamecodetypeid 
join seasonweek s2 on m3.seasonweekid = s2.seasonweekid 
where s.seasonid = '${seasonId}' and s2.weeknumber = ${weekNumber}`;

  const result = await pool.query(query);

  const MatchupRosterModel = result.rows as MatchupRosterModel[];

  return MatchupRosterModel;
}

async function ImportMatchupRosterPlayerStat(
  matchupRoster: MatchupRosterModel,
  seasonStatCategory: SeasonStatCategoryModel,
  value: string
): Promise<MatchupRosterPlayerStatModel> {
  let query = `select * from matchuprosterplayerstat where matchuprosterid = ${matchupRoster.matchuprosterid} and seasonstatcategoryid = ${seasonStatCategory.seasonstatcategoryid} limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    query = `INSERT INTO matchuprosterplayerstat(matchuprosterid, seasonstatcategoryid, value) VALUES(${matchupRoster.matchuprosterid}, ${seasonStatCategory.seasonstatcategoryid}, '${value}')RETURNING *`;
    result = await pool.query(query);

    const MatchupRosterModel = result.rows[0] as MatchupRosterPlayerStatModel;
  }

  const MatchupRosterModel = result.rows[0] as MatchupRosterPlayerStatModel;

  return MatchupRosterModel;
}

export default {
  ImportMatchupRosterPlayerStat,
  GetRosterPlayerStatsToImportForWeek
};
