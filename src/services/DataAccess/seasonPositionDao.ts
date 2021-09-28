import pool from '../../database/db';
import { RosterPositionModel } from '../../Models/RosterPositionModel';
import { SeasonModel } from '../../Models/SeasonModel';
import { SeasonPositionModel } from '../../Models/SeasonPositionModel';
import { RosterPosition } from '../../Types/RosterPosition';

async function GetSeasonPostion(
  seasonid: number,
  positionName: string
): Promise<SeasonPositionModel> {
  const query = `select * from seasonposition s 
join rosterposition r on s.rosterpositionid = r.rosterpositionid 
where s.seasonid = ${seasonid} and r.positionname = '${positionName}' limit 1`;
  const result = await pool.query(query);

  const seasonPositionModel = result.rows[0] as SeasonPositionModel;

  return seasonPositionModel;
}

async function GetOrImportSeasonPosition(
  season: SeasonModel,
  rosterpositionModel: RosterPositionModel,
  positionType: RosterPosition
): Promise<SeasonPositionModel> {
  let query = `select * from seasonposition where seasonid = ${season.seasonid} and rosterpositionid = ${rosterpositionModel.rosterpositionid} limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    let count = 0;

    if (positionType != null) {
      count = positionType.count;
    }
    query = `INSERT INTO public.seasonposition
(seasonid, rosterpositionid, count)
VALUES(${season.seasonid}, ${rosterpositionModel.rosterpositionid}, ${count}) RETURNING *`;

    result = await pool.query(query);
  }

  const seasonPositionModel = result.rows[0] as SeasonPositionModel;

  return seasonPositionModel;
}

export default {
  GetOrImportSeasonPosition,
  GetSeasonPostion
};
