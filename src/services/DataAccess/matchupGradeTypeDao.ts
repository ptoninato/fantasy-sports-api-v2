import pool from '../../database/db';
import { MatchupGradeTypeModel } from '../../Models/MatchupGradeTypeModel';

async function GetOrImportMatchupGradeType(
  grade: string
): Promise<MatchupGradeTypeModel> {
  let query = `select * from matchupgradetype where grade = '${grade}' limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    query = `INSERT INTO matchupgradetype
(grade)
VALUES('${grade}') RETURNING *`;

    result = await pool.query(query);
  }

  const matchupGradeTypeModel = result.rows[0] as MatchupGradeTypeModel;

  return matchupGradeTypeModel;
}

export default {
  GetOrImportMatchupGradeType
};
