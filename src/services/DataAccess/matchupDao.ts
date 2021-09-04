import pool from '../../database/db';
import { MatchupModel } from '../../Models/MatchupModel';

async function GetMatchup(
  seasonid: number,
  seasonweekid: number,
  dbTeam1id: number,
  dbTeam2Id: number
): Promise<MatchupModel> {
  const query = `select * from matchup where seasonid = ${seasonid} and seasonweekid = ${seasonweekid} and (fantasyteamid1 = ${dbTeam1id} or fantasyteamid1 = ${dbTeam2Id}) and (fantasyteamid2 = ${dbTeam2Id} or fantasyteamid2 = ${dbTeam2Id}) limit 1`;

  const result = await pool.query(query);

  if (result.rowCount === 1) {
    return result.rows[0] as MatchupModel;
  }

  return null;
}

async function GetOrImportMatchup(
  matchup: MatchupModel
): Promise<MatchupModel> {
  let matchupDb = await GetMatchup(
    matchup.seasonid,
    matchup.seasonweekid,
    matchup.fantasyteamid1,
    matchup.fantasyteamid2
  );

  if (matchupDb == null) {
    let query;

    if (matchup.matchuprecap == null && matchup.matchuprecaptitle == null) {
      query = `INSERT INTO matchup(fantasyteamid1, fantasyteamid2, winningteamid, isplayoffs, isconsolation, seasonid, matchuprecap, matchuprecaptitle, seasonweekid, losingteamid, tie) VALUES(${matchup.fantasyteamid1}, ${matchup.fantasyteamid2}, ${matchup.winningteamid}, ${matchup.isplayoffs}, ${matchup.isconsolation}, ${matchup.seasonid}, ${matchup.matchuprecap}, ${matchup.matchuprecaptitle}, ${matchup.seasonweekid}, ${matchup.losingteamid}, ${matchup.tie}) returning *`;
    } else {
      query = `INSERT INTO matchup(fantasyteamid1, fantasyteamid2, winningteamid, isplayoffs, isconsolation, seasonid, matchuprecap, matchuprecaptitle, seasonweekid, losingteamid, tie) VALUES(${matchup.fantasyteamid1}, ${matchup.fantasyteamid2}, ${matchup.winningteamid}, ${matchup.isplayoffs}, ${matchup.isconsolation}, ${matchup.seasonid}, '${matchup.matchuprecap}', '${matchup.matchuprecaptitle}', ${matchup.seasonweekid}, ${matchup.losingteamid}, ${matchup.tie}) returning *`;
    }

    const insertResult = await pool.query(query);

    matchupDb = insertResult.rows[0] as MatchupModel;
  }

  return matchupDb;
}

export default {
  GetOrImportMatchup
};
