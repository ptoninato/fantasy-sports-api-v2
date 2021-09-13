import pool from '../../database/db';
import { MatchupRosterModel } from '../../Models/MatchupRosterModel';
import { MatchupTeamModel } from '../../Models/MatchupTeamModel';
import { PlayerModel } from '../../Models/PlayerModel';
import { SeasonPositionModel } from '../../Models/SeasonPositionModel';
import { Player } from '../../Types/Player';
import { Roster } from '../../Types/Roster';

async function GetOrImportMatchupRoster(
  rosterSpot: Roster,
  gamedate: Date,
  seasonPostion: SeasonPositionModel,
  matchupTeam: MatchupTeamModel,
  player: PlayerModel
): Promise<MatchupRosterModel> {
  let query = `select * from matchuproster where matchupteamid = ${matchupTeam.matchupteamid} and seasonpositionid = ${seasonPostion.seasonpositionid} and playerid = ${player.playerid} limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    query = `INSERT INTO matchuproster(matchupteamid, playerid, gamedate, seasonpositionid) VALUES(${matchupTeam.matchupteamid}, ${player.playerid}, ${gamedate}, ${seasonPostion.seasonpositionid}) RETURNING *`;
    result = await pool.query(query);
  }

  const MatchupRosterModel = result.rows[0] as MatchupRosterModel;

  return MatchupRosterModel;
}

export default {
  GetOrImportMatchupRoster
};
