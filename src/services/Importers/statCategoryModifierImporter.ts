import { LeagueKeyParam } from '../../Types/LeagueKeyParam';
import leagueDao from '../../services/DataAccess/leagueDao';
import SeasonDao from '../../services/DataAccess/SeasonDao';
import leagueSettingsApiService from '../../services/api/YahooApi/leagueSettingsApiService';
import seasonStatCategoryDao from '../../services/DataAccess/seasonStatCategoryDao';
import statCategoryImport from '../../services/Importers/statCategoryImport';
import seasonStatModiferDao from '../../services/DataAccess/seasonStatModiferDao';

async function importStatCategoryModifier(
  leagueKeyParam: LeagueKeyParam
): Promise<any> {
  const leagueSettings = await leagueSettingsApiService.getLeagueSettingsByLeagueKey(
    leagueKeyParam.league_key
  );
  const league = await leagueDao.GetOrImportLeague(leagueKeyParam.league_key);
  const season = await SeasonDao.GetOrImportSeason(leagueKeyParam);

  await statCategoryImport.importStatCategory(leagueKeyParam);

  if (leagueSettings.settings.stat_modifiers) {
    const importStatCategoryModifiers =
      leagueSettings.settings.stat_modifiers.stats;

    for (let i = 0; i <= importStatCategoryModifiers.length - 1; i++) {
      const statModifier = importStatCategoryModifiers[i].stat;
      const statCategoryId = statModifier.stat_id;

      const statCategory = await seasonStatCategoryDao.GetStatCategoryForCategoryType(
        statCategoryId,
        season,
        league.gamecodetypeid
      );

      const result = await seasonStatModiferDao.GetOrImportStatCategoryModifier(
        statCategory,
        <number>(<unknown>statModifier.value)
      );
    }
  }
}

export default { importStatCategoryModifier };
