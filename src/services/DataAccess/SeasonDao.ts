import pool from '../../database/db';
import { SeasonModel } from '../../Models/SeasonModel';
import { LeagueKeyParam } from '../../Types/LeagueKeyParam';
import seasonImporter from '../Importers/seasonImporter';

const GetSeasonByYahooLeagueIdAndGameCodeId = async (
  yahooleagueid: number,
  gamecodeid: number
): Promise<SeasonModel> => {
  try {
    const query = `select * from season where gamecodeid = ${gamecodeid} and yahooleagueId = ${yahooleagueid}`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const season = result.rows[0] as SeasonModel;
      return season;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetSeasonByYahooLeagueId = async (
  yahooleagueid: number
): Promise<SeasonModel> => {
  try {
    const query = `select * from season where yahooleagueId = '${yahooleagueid}'`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const season = result.rows[0] as SeasonModel;
      return season;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetOrImportSeason = async (
  leagueKeyParam: LeagueKeyParam
): Promise<SeasonModel> => {
  try {
    let season = await GetSeasonByYahooLeagueId(
      <number>(<unknown>leagueKeyParam.league_id)
    );

    if (season == null) {
      season = await seasonImporter.importSeason(leagueKeyParam.league_key);
    }

    return season;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const insertSeason = async (seasonModel: SeasonModel): Promise<SeasonModel> => {
  const query = `INSERT INTO public.season
      (leagueid, gamecodeid, yahooleagueid, startdate, enddate, seasonyear, scoringtype, firstweek, lastweek, tradeenddate, playoffstartweek)
      VALUES(${seasonModel.leagueid}, ${seasonModel.gamecodeid}, ${seasonModel.yahooleagueid}, '${seasonModel.startdate}', '${seasonModel.enddate}', '${seasonModel.seasonyear}', '${seasonModel.scoringtype}', ${seasonModel.firstweek}, ${seasonModel.lastweek}, '${seasonModel.tradeenddate}', ${seasonModel.playoffstartweek});
`;

  const result = await pool.query(query);

  if (result.rowCount == 1) {
    const season = result.rows[0] as SeasonModel;
    return season;
  }

  return null;

  //  const query = `insert into league(gamecodetypeid, leaguename) values ('${gamecodetypedi}', '${leaguename}') RETURNING * `;
};

export default {
  GetOrImportSeason,
  GetSeasonByYahooLeagueIdAndGameCodeId,
  GetSeasonByYahooLeagueId,
  insertSeason
};
