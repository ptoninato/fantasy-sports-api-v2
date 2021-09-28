import { match } from 'assert';
import pool from '../../database/db';
import { MatchupCategoryResultModel } from '../../Models/MatchupCategoryResultModel';
import { MatchupModel } from '../../Models/MatchupModel';
import { MatchupTeamModel } from '../../Models/MatchupTeamModel';

async function GetMatchupCategoryResult(
  matchupid: number,
  seasonstatcategoryid: number
): Promise<MatchupCategoryResultModel> {
  const query = `select * from matchupcategoryresult where matchupid = ${matchupid} and seasonstatcategoryid = ${seasonstatcategoryid} limit 1`;

  const result = await pool.query(query);

  if (result.rowCount === 1) {
    return result.rows[0] as MatchupCategoryResultModel;
  }

  return null;
}

async function GetOrImportMatchupCategoryResult(
  matchupCategoryResultModel: MatchupCategoryResultModel
): Promise<MatchupCategoryResultModel> {
  let matchupCategoryResult = await GetMatchupCategoryResult(
    matchupCategoryResultModel.matchupid,
    matchupCategoryResultModel.seasonstatcategoryid
  );

  if (matchupCategoryResult == null) {
    const query = `INSERT INTO public.matchupcategoryresult
(matchupid, seasonstatcategoryid, winningteamid, losingteamid, istied)
VALUES(${matchupCategoryResultModel.matchupid}, ${matchupCategoryResultModel.seasonstatcategoryid}, ${matchupCategoryResultModel.winningteamid}, ${matchupCategoryResultModel.losingteamid}, ${matchupCategoryResultModel.istied})
 RETURNING *`;
    const insertResult = await pool.query(query);
    matchupCategoryResult = insertResult.rows[0] as MatchupCategoryResultModel;
  }

  return matchupCategoryResult;
}

export default {
  GetMatchupCategoryResult,
  GetOrImportMatchupCategoryResult
};
