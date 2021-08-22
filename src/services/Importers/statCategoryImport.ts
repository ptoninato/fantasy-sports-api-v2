import { LeagueKeyParam } from '../../Types/LeagueKeyParam';
import leagueDao from '../../services/DataAccess/leagueDao';
import seasonDao from '../../services/DataAccess/SeasonDao';
import leagueSettingsApiService from '../../services/api/YahooApi/leagueSettingsApiService';
import statCategoryTypeDao from '../../services/DataAccess/seasonStatCategoryTypeDao';
import positionTypeDao from '../../services/DataAccess/positionTypeDao';
import seasonStatCategoryDao from '../../services/DataAccess/seasonStatCategoryDao';

async function importStatCategory(
  leagueKeyParam: LeagueKeyParam
): Promise<any> {
  const leagueSettings = await leagueSettingsApiService.getLeagueSettingsByLeagueKey(
    leagueKeyParam.league_key
  );
  const league = await leagueDao.GetOrImportLeague(leagueKeyParam.league_key);

  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);

  const stateCategories = leagueSettings.settings.stat_categories;

  for (let i = 0; i < stateCategories.length; i++) {
    const gameCodeTypeId = league.gamecodetypeid;
    const statCategory = stateCategories[i];

    const positionTypeModel = await positionTypeDao.GetOrImportPositionType(
      statCategory.position_type,
      gameCodeTypeId
    );

    const statCategoryType = await statCategoryTypeDao.GetOrImportStatCategoryType(
      statCategory,
      positionTypeModel
    );

    const statCategoryModel = await seasonStatCategoryDao.GetOrImportStatCategory(
      statCategory,
      season,
      statCategoryType
    );
  }
}

export default { importStatCategory };
