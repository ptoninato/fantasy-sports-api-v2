import pool from '../../database/db';
import { GameCodeType } from '../../Models/GameCodeType';
import { LeagueModel } from '../../Models/LeagueModel';
import { PlayerModel } from '../../Models/PlayerModel';
import { Player } from '../../Types/Player';
import { Roster } from '../../Types/Roster';
import positionTypeDao from '../DataAccess/positionTypeDao';

const GetPlayerByYahooPlayerIdAndGameCodeTypeId = async (
  playerId: number,
  gameCodeTypeId: number
): Promise<PlayerModel> => {
  try {
    const query = `select * from player where gamecodetypeid = ${gameCodeTypeId} and yahooplayerid = ${playerId} limit 1`;

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
  gameCodeTypeId: number
): Promise<PlayerModel> => {
  try {
    let lastName = player.name.last.length == 0 ? 'Defense' : player.name.last;
    lastName = lastName.replace(/'/g, "''");

    const firstName = player.name.first.replace(/'/g, "''");
    const positionTypeModel = await positionTypeDao.GetOrImportPositionType(
      player.position_type,
      gameCodeTypeId
    );

    const query = `INSERT INTO public.player
(gamecodetypeid, yahooplayerid, firstname, lastname, positiontypeid)
VALUES(${gameCodeTypeId}, ${player.player_id}, '${firstName}', '${lastName}', ${positionTypeModel.positiontypeid}) RETURNING *`;

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
      <number>(<unknown>player.player_id),
      league.gamecodetypeid
    );

    if (playerModel == null) {
      playerModel = await InsertPlayer(player, league.gamecodetypeid);
    }

    return playerModel;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetOrImportPlayerRoster = async (
  player: Roster,
  league: LeagueModel
): Promise<PlayerModel> => {
  try {
    let playerModel = await GetPlayerByYahooPlayerIdAndGameCodeTypeId(
      <number>(<unknown>player.player_id),
      league.gamecodetypeid
    );

    if (playerModel == null) {
      playerModel = await InsertPlayer(
        (player as unknown) as Player,
        league.gamecodetypeid
      );
    }

    return playerModel;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetOrImportPlayerUsingGameCodeTypeAndRoster = async (
  player: Roster,
  gameCodeTypeModel: GameCodeType
): Promise<PlayerModel> => {
  try {
    let playerModel = await GetPlayerByYahooPlayerIdAndGameCodeTypeId(
      <number>(<unknown>player.player_id),
      gameCodeTypeModel.gamecodetypeid
    );

    if (playerModel == null) {
      playerModel = await InsertPlayer(
        (player as unknown) as Player,
        gameCodeTypeModel.gamecodetypeid
      );

      console.log(playerModel);
    }

    return playerModel;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default {
  GetPlayerByYahooPlayerIdAndGameCodeTypeId,
  GetOrImportPlayer,
  GetOrImportPlayerUsingGameCodeTypeAndRoster
};
