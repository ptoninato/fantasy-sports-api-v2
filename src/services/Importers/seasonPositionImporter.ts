import leagueDao from '../DataAccess/leagueDao';
import gameKeyDao from '../DataAccess/gameKeyDao';
import leagueSettingsApiService from '../api/YahooApi/leagueSettingsApiService';
import seasonDao from '../DataAccess/SeasonDao';
import positionTypeDao from '../DataAccess/positionTypeDao';
import rosterPostionDao from '../DataAccess/rosterPostionDao';
import { LeagueKeyParam } from '../../Types/LeagueKeyParam';
import seasonPositionDao from '../DataAccess/seasonPositionDao';
import { RosterPosition } from '../../Types/RosterPosition';
import { SeasonPositionModel } from '../../Models/SeasonPositionModel';

async function importSeasonPositions(
  leagueKeyParam: LeagueKeyParam
): Promise<any> {
  const leagueSettings = await leagueSettingsApiService.getLeagueSettingsByLeagueKey(
    leagueKeyParam.league_key
  );

  const league = await leagueDao.GetOrImportLeague(leagueKeyParam.league_key);

  const gamekey = await gameKeyDao.getOrInsertGameKey(
    leagueKeyParam.league_key
  );

  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);

  const rosterPostions = leagueSettings.settings.roster_positions;
  console.log(rosterPostions);
  for (let i = 0; i < rosterPostions.length; i++) {
    const position = rosterPostions[i];

    const positionType = await positionTypeDao.GetOrImportPositionType(
      position.position_type,
      league.gamecodetypeid
    );
    const positiontypeid = positionType ? positionType.positiontypeid : null;

    const rosterPostionModel = await rosterPostionDao.GetOrImportRosterPosition(
      position.position,
      league.gamecodetypeid,
      positiontypeid
    );

    const seasponPositionModel = await seasonPositionDao.GetOrImportSeasonPosition(
      season,
      rosterPostionModel,
      position
    );
  }
}

async function importSeasonPosition(
  leagueKeyParam: LeagueKeyParam,
  positionNameParam: string
): Promise<SeasonPositionModel> {
  const leagueSettings = await leagueSettingsApiService.getLeagueSettingsByLeagueKey(
    leagueKeyParam.league_key
  );

  const league = await leagueDao.GetOrImportLeague(leagueKeyParam.league_key);

  const gamekey = await gameKeyDao.getOrInsertGameKey(
    leagueKeyParam.league_key
  );

  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);

  const rosterPostions = leagueSettings.settings.roster_positions;

  const positions = rosterPostions.filter(
    (x) => x.position === positionNameParam
  ) as RosterPosition[];

  let position;
  let positionType;
  if (positions.length > 0) {
    position = positions[0];

    positionType = await positionTypeDao.GetOrImportPositionType(
      position.position_type,
      league.gamecodetypeid
    );
  }

  const positiontypeid = positionType ? positionType.positiontypeid : null;

  const positionName = position ? position.position : positionNameParam;

  const rosterPostionModel = await rosterPostionDao.GetOrImportRosterPosition(
    positionName,
    league.gamecodetypeid,
    positiontypeid
  );
  console.log(rosterPostionModel);

  const seasponPositionModel = await seasonPositionDao.GetOrImportSeasonPosition(
    season,
    rosterPostionModel,
    position
  );

  console.log(seasponPositionModel);
  return seasponPositionModel;
}

export default { importSeasonPositions, importSeasonPosition };
