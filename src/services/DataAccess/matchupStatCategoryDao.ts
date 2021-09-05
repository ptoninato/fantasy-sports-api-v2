import pool from '../../database/db';
import { MatchupCategoryTeamModel } from '../../Models/MatchupCategoryTeamModel';
import { MatchupTeamModel } from '../../Models/MatchupTeamModel';
import { SeasonStatCategoryModel } from '../../Models/StatCategoryModel';
import { Stat } from '../../Types/Scoreboard';

async function GetOrImportMatchupStatCategory(
  stat: Stat,
  statCategoryModel: SeasonStatCategoryModel,
  matchupTeam: MatchupTeamModel
): Promise<MatchupCategoryTeamModel> {
  let query = `select * from matchupcategoryteam where matchupteamid = '${matchupTeam.matchupteamid}' and seasonstatcategoryid = ${statCategoryModel.seasonstatcategoryid} limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    query = `INSERT INTO matchupcategoryteam
(matchupteamid, seasonstatcategoryid, value)
VALUES(${matchupTeam.matchupteamid}, ${statCategoryModel.seasonstatcategoryid}, '${stat.value}') RETURNING *`;
    result = await pool.query(query);
  }

  const MatchupCategoryTeamModel = result.rows[0] as MatchupCategoryTeamModel;

  console.log(MatchupCategoryTeamModel);

  return MatchupCategoryTeamModel;
}

export default {
  GetOrImportMatchupStatCategory
};
