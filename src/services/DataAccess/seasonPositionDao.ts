import pool from '../../database/db';
import { RosterPositionModel } from '../../Models/RosterPositionModel';
import { SeasonModel } from '../../Models/SeasonModel';
import { SeasonPositionModel } from '../../Models/SeasonPositionModel';
import { RosterPosition } from '../../Types/RosterPosition';

async function GetOrImportSeasonPosition(
  season: SeasonModel,
  rosterpositionModel: RosterPositionModel,
  positionType: RosterPosition
): Promise<SeasonPositionModel> {
  let query = `select * from seasonposition where seasonid = ${season.seasonid} and rosterpositionid = ${rosterpositionModel.rosterpositionid} limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    query = `INSERT INTO public.seasonposition
(seasonid, rosterpositionid, count)
VALUES(${season.seasonid}, ${rosterpositionModel.rosterpositionid}, ${positionType.count}) RETURNING *`;

    result = await pool.query(query);
  }

  const seasonPositionModel = result.rows[0] as SeasonPositionModel;

  return seasonPositionModel;
}

export default {
  GetOrImportSeasonPosition
};
