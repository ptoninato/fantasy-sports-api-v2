import pool from '../../database/db';
import { RosterPositionModel } from '../../Models/RosterPositionModel';

async function GetOrImportRosterPosition(
  positionname: string,
  gamecodetypeid: number,
  positiontypeid: number
): Promise<RosterPositionModel> {
  let query = `select * from rosterposition where positionname = '${positionname}' and gamecodetypeid = ${gamecodetypeid} limit 1`;
  console.log(query);

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    if (positiontypeid == undefined) {
      positiontypeid = null;
    }

    query = `INSERT INTO public.rosterposition
(positionname, gamecodetypeid, positiontypeid)
VALUES('${positionname}', ${gamecodetypeid}, ${positiontypeid}) RETURNING *`;

    console.log(query);

    result = await pool.query(query);
  }

  const positionTypeModel = result.rows[0] as RosterPositionModel;

  return positionTypeModel;
}

export default {
  GetOrImportRosterPosition
};
