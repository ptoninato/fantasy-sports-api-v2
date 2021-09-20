import pool from '../../database/db';
import { MatchupModel } from '../../Models/MatchupModel';
import { MatchupTeamModel } from '../../Models/MatchupTeamModel';

async function GetMatchupTeam(
  matchupid: number,
  fantasyteamid: number
): Promise<MatchupTeamModel> {
  const query = `select * from matchupteam where matchupid = ${matchupid} and fantasyteamid = ${fantasyteamid} limit 1`;

  const result = await pool.query(query);

  if (result.rowCount === 1) {
    return result.rows[0] as MatchupTeamModel;
  }

  return null;
}

async function GetMatchupTeamByMatchupTeamId(
  matchupteamid: number
): Promise<MatchupTeamModel> {
  const query = `select * from matchupteam where matchupteamid = ${matchupteamid}  limit 1`;

  const result = await pool.query(query);

  if (result.rowCount === 1) {
    return result.rows[0] as MatchupTeamModel;
  }

  return null;
}

async function GetMatchupTied(matchupid: number): Promise<MatchupTeamModel> {
  const query = `select * from matchupteam where matchupid = ${matchupid} and tiedpoints is not null limit 1`;

  const result = await pool.query(query);

  if (result.rowCount === 1) {
    return result.rows[0] as MatchupTeamModel;
  }

  return null;
}

async function GetOrImportMatchupTeam(
  matchupTeam: MatchupTeamModel
): Promise<MatchupTeamModel> {
  let matchupTeamDb = await GetMatchupTeam(
    matchupTeam.matchupid,
    matchupTeam.fantasyteamid
  );

  if (matchupTeamDb == null) {
    const query = `INSERT INTO matchupteam(matchupid, fantasyteamid, pointsfor, projectedpointsfor, matchupgradetypeid) VALUES(${matchupTeam.matchupid}, ${matchupTeam.fantasyteamid}, ${matchupTeam.pointsfor}, ${matchupTeam.projectedpoitsfor}, ${matchupTeam.matchupgradetypeid}) RETURNING *`;
    const insertResult = await pool.query(query);
    matchupTeamDb = insertResult.rows[0] as MatchupTeamModel;
  }

  return matchupTeamDb;
}

async function GetOrImportMatchupTiedScores(
  matchupTeam: MatchupTeamModel
): Promise<MatchupTeamModel> {
  let matchupTeamDb = await GetMatchupTied(matchupTeam.matchupid);

  if (matchupTeamDb == null) {
    const query = `INSERT INTO matchupteam(matchupid, tiedpoints) VALUES(${matchupTeam.matchupid}, ${matchupTeam.tiedpoints})`;

    const insertResult = await pool.query(query);

    matchupTeamDb = insertResult.rows[0] as MatchupTeamModel;
  }

  return matchupTeamDb;
}

export default {
  GetOrImportMatchupTeam,
  GetOrImportMatchupTiedScores,
  GetMatchupTeam,
  GetMatchupTeamByMatchupTeamId
};
