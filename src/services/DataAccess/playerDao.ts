import pool from '../../database/db';
import { LeagueModel } from '../../Models/LeagueModel';
import { PlayerModel } from '../../Models/PlayerModel';
import { Player } from '../../Types/Player';
import positionTypeDao from '../DataAccess/positionTypeDao';

const GetPlayerByYahooPlayerIdAndGameCodeTypeId = async (
  player: Player,
  league: LeagueModel
): Promise<PlayerModel> => {
  try {
    const query = `select * from player where gamecodetypeid = ${league.gamecodetypeid} and yahooplayerid = ${player.player_id} limit 1`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const owners = result.rows[0] as PlayerModel;
      return owners;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const InsertPlayer = async (
  player: Player,
  league: LeagueModel
): Promise<PlayerModel> => {
  try {
    const lastName =
      player.name.last.length == 0 ? 'Defense' : player.name.last;

    const positionTypeModel = await positionTypeDao.GetOrImportPositionType(
      player.position_type,
      league.gamecodetypeid
    );

    const query = `INSERT INTO public.player
(gamecodetypeid, yahooplayerid, firstname, lastname, positiontypeid)
VALUES(${league.gamecodetypeid}, ${player.player_id}, '${player.name.first}', '${lastName}', ${positionTypeModel.positiontypeid}) RETURNING *`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const player = result.rows[0] as PlayerModel;
      return player;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetOrImportPlayer = async (
  player: Player,
  league: LeagueModel
): Promise<PlayerModel> => {
  try {
    let playerModel = await GetPlayerByYahooPlayerIdAndGameCodeTypeId(
      player,
      league
    );

    if (playerModel == null) {
      playerModel = await InsertPlayer(player, league);
    }

    return playerModel;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default {
  GetPlayerByYahooPlayerIdAndGameCodeTypeId,
  GetOrImportPlayer
};
