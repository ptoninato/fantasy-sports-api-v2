import pool from '../../database/db';
import { PositionTypeModel } from '../../Models/PositionTypeModel';
import { SeasonModel } from '../../Models/SeasonModel';
import { SeasonStatCategoryTypeModel } from '../../Models/SeasonStatCategoryTypeModel';
import { SeasonStatCategoryModel } from '../../Models/StatCategoryModel';
import { StatCategory } from '../../Types/StatCategory';
import { StatPositionType } from '../../Types/StatPositionType';
import seasonStatCategoryTypeDao from './seasonStatCategoryTypeDao';

async function GetStatCategoryForSeason(
  yahoocategoryid: number,
  seasonid: number
): Promise<SeasonStatCategoryModel> {
  const query = `select s.* from seasonstatcategory s join seasonstatcategorytype st on s.seasonstatcategorytypeid = st.seasonstatcategorytypeid where s.seasonid = ${seasonid} and st.yahoocategoryid = ${yahoocategoryid} limit 1`;

  const result = await pool.query(query);

  const statCategoryModel = result.rows[0] as SeasonStatCategoryModel;

  return statCategoryModel;
}

async function GetStatCategoryForCategoryType(
  yahoocategoryid: number,
  season: SeasonModel,
  gamecodetypeid: number
): Promise<SeasonStatCategoryModel> {
  const seasonStatCategoryTypeModel = await seasonStatCategoryTypeDao.GetStatCategoryTypeByYahooTypeId(
    yahoocategoryid,
    gamecodetypeid
  );

  const query = `select * from seasonstatcategory where seasonstatcategorytypeid = ${seasonStatCategoryTypeModel.seasonstatcategorytypeid} and seasonid = ${season.seasonid} limit 1`;
  const result = await pool.query(query);

  const statCategoryModel = result.rows[0] as SeasonStatCategoryModel;

  return statCategoryModel;
}

async function GetOrImportStatCategory(
  statCategory: StatCategory,
  season: SeasonModel,
  statCategoryType: SeasonStatCategoryTypeModel
): Promise<SeasonStatCategoryModel> {
  let query = `select * from seasonstatcategory where seasonstatcategorytypeid = ${statCategoryType.seasonstatcategorytypeid} and seasonid = ${season.seasonid} limit 1`;
  let result = await pool.query(query);

  if (result.rowCount == 0) {
    const enabled = statCategory.enabled == 1 ? 'true' : 'false';

    query = `INSERT INTO public.seasonstatcategory
(seasonstatcategorytypeid, seasonid, enabled)
VALUES(${statCategoryType.seasonstatcategorytypeid}, ${season.seasonid}, ${enabled})
 RETURNING *`;
    result = await pool.query(query);
  }

  const statCategoryModel = result.rows[0] as SeasonStatCategoryModel;

  return statCategoryModel;
}

export default {
  GetOrImportStatCategory,
  GetStatCategoryForCategoryType,
  GetStatCategoryForSeason
};
