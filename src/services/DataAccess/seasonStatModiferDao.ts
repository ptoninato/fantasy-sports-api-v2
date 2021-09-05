import { SeasonStatCategoryModel } from '../../Models/StatCategoryModel';
import pool from '../../database/db';
import { SeasonStatCategoryModifierModel } from '../../Models/SeasonStatCategoryModifier';

async function GetOrImportStatCategoryModifier(
  statCategory: SeasonStatCategoryModel,
  value: number
): Promise<SeasonStatCategoryModifierModel> {
  let query = `select * from seasonstatmodifier where seasonstatcategoryid = ${statCategory.seasonstatcategoryid} limit 1`;
  let result = await pool.query(query);
  if (result.rowCount == 0) {
    query = `INSERT INTO seasonstatmodifier
(seasonstatcategoryid, value)
VALUES(${statCategory.seasonstatcategoryid}, ${value})
 RETURNING *`;
    result = await pool.query(query);
  }

  const statCategoryModel = result.rows[0] as SeasonStatCategoryModifierModel;

  return statCategoryModel;
}

export default {
  GetOrImportStatCategoryModifier
};
