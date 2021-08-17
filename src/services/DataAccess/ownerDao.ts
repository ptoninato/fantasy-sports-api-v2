import pool from '../../database/db';
import { LeagueModel } from '../../Models/LeagueModel';
import { OwnerModel } from '../../Models/Owner';
import { Manager } from '../../Types/Manager';

const GetAllOwners = async (): Promise<OwnerModel[]> => {
  try {
    const query = `select * from owner`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const owners = result.rows as OwnerModel[];
      return owners;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetOwnerByYahooGuid = async (yahooguid: string): Promise<OwnerModel> => {
  try {
    const query = `select * from owner where yahooguid = '${yahooguid}' limit 1`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const owners = result.rows[0] as OwnerModel;
      return owners;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetOrImportOwner = async (
  manager: Manager,
  league: LeagueModel
): Promise<OwnerModel> => {
  try {
    let owner = await GetOwnerByYahooGuid(manager.guid);

    if (owner == null) {
      owner = await InsertOwner(manager, league);
    }

    return owner;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const InsertOwner = async (
  manager: Manager,
  league: LeagueModel
): Promise<OwnerModel> => {
  try {
    const query = `INSERT INTO public."owner" (leagueid, ownername, email, yahoomanagerid, yahooguid) VALUES(${league.leagueid}, '${manager.nickname}', '${manager.email}', '${manager.manager_id}', '${manager.guid}') RETURNING *`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const owners = result.rows[0] as OwnerModel;
      return owners;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default {
  GetAllOwners,
  GetOwnerByYahooGuid,
  GetOrImportOwner,
  InsertOwner
};
