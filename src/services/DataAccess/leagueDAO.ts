import pool from '../../database/db';
import { LeagueModel } from '../../Models/LeagueModel';
import leagueImporter from '../Importers/leagueImporter';
import leagueApiService from '../api/YahooApi/leagueApiService';

const GetLeagueRecords = async () => {
  try {
    const result = await pool.query('SELECT * FROM league');

    if (result.rowCount == 1) {
      const gamecodetype = result.rows as LeagueModel[];
      return gamecodetype;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetLeagueByLeagueName = async (
  leaguename: string
): Promise<LeagueModel> => {
  try {
    const query = `select * from league where leaguename = '${leaguename}' limit 1`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const league = result.rows[0] as LeagueModel;
      return league;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetOrImportLeague = async (league_key: string): Promise<LeagueModel> => {
  try {
    const leagueSettings = await leagueApiService.getLeagueMetaDataByLeagueKey(
      league_key
    );

    let league = await GetLeagueByLeagueName(leagueSettings.name);

    if (league == null) {
      league = await leagueImporter.importLeague(league_key);
    }

    return league;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const insertLeague = async (
  leaguename: string,
  gamecodetypedi: number
): Promise<LeagueModel> => {
  try {
    const query = `insert into league(gamecodetypeid, leaguename) values ('${gamecodetypedi}', '${leaguename}') RETURNING * `;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const gamecodetype = result.rows[0] as LeagueModel;
      return gamecodetype;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default {
  GetLeagueRecords,
  GetLeagueByLeagueName,
  insertLeague,
  GetOrImportLeague
};
