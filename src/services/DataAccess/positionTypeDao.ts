import pool from '../../database/db';
import { PositionTypeModel } from '../../Models/PositionTypeModel';

async function GetOrImportPositionType(
  yahoopositionname: string,
  gamecodetypeid: number
): Promise<PositionTypeModel> {
  let query = `select * from positiontype where yahoopositiontype = '${yahoopositionname}' and gamecodetypeid = ${gamecodetypeid} limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0 && yahoopositionname != undefined) {
    query = `INSERT INTO public.positiontype
(yahoopositiontype, gamecodetypeid)
VALUES('${yahoopositionname}', ${gamecodetypeid}) RETURNING *`;
    result = await pool.query(query);
  }

  const positionTypeModel = result.rows[0] as PositionTypeModel;

  return positionTypeModel;
}

export default {
  GetOrImportPositionType
};
