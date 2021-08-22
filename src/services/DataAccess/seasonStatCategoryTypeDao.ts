import pool from '../../database/db';
import { PositionTypeModel } from '../../Models/PositionTypeModel';
import { SeasonStatCategoryTypeModel } from '../../Models/SeasonStatCategoryTypeModel';
import { SeasonStatCategoryModel } from '../../Models/StatCategoryModel';
import { StatCategory } from '../../Types/StatCategory';

async function GetStatCategoryTypeByYahooTypeId(
  yahoocategoryid: number
): Promise<SeasonStatCategoryTypeModel> {
  const query = `select * from seasonstatcategorytype where yahoocategoryid = ${yahoocategoryid} limit 1`;

  const result = await pool.query(query);

  const statCategoryTypeModel = result.rows[0] as SeasonStatCategoryTypeModel;

  return statCategoryTypeModel;
}

async function GetOrImportStatCategoryType(
  statCategory: StatCategory,
  positionTypeModel: PositionTypeModel
): Promise<SeasonStatCategoryTypeModel> {
  let query = `select * from seasonstatcategorytype where yahoocategoryid = ${statCategory.stat_id} and gamecodetypeid = ${positionTypeModel.gamecodetypeid} limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    query = `INSERT INTO public.seasonstatcategorytype
(yahoocategoryid, "name", displayname, gamecodetypeid, positiontypeid)
VALUES(${statCategory.stat_id}, '${statCategory.name}', '${statCategory.display_name}', ${positionTypeModel.gamecodetypeid}, ${positionTypeModel.positiontypeid}) RETURNING *`;
    result = await pool.query(query);
  }

  const statCategoryTypeModel = result.rows[0] as SeasonStatCategoryTypeModel;

  return statCategoryTypeModel;
}

export default {
  GetOrImportStatCategoryType,
  GetStatCategoryTypeByYahooTypeId
};
