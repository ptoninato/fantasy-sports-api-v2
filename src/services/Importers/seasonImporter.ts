import leagueDao from '../DataAccess/leagueDao';
import gameKeyDao from '../DataAccess/gameKeyDao';
import leagueSettingsApiService from '../api/YahooApi/leagueSettingsApiService';
import seasonDao from '../DataAccess/SeasonDao';
import { SeasonModel } from '../../Models/SeasonModel';

async function importSeason(league_key: string): Promise<SeasonModel> {
  const leagueKeySplit = league_key.split('.');
  const yahooGameKey = leagueKeySplit[0];
  const yahooleagueId = leagueKeySplit[2];

  const leagueSettings = await leagueSettingsApiService.getLeagueSettingsByLeagueKey(
    league_key
  );

  const league = await leagueDao.GetOrImportLeague(league_key);

  const gamekey = await gameKeyDao.getOrInsertGameKey(yahooGameKey);
  const seasonModel = <SeasonModel>Object.create({});

  seasonModel.leagueid = league.leagueid;
  seasonModel.gamecodeid = gamekey.gamekeyid;
  seasonModel.yahooleagueid = <number>(<unknown>yahooleagueId);
  seasonModel.startdate = leagueSettings.start_date;
  seasonModel.enddate = leagueSettings.end_date;
  seasonModel.seasonyear = <number>(<unknown>leagueSettings.season);
  seasonModel.scoringtype = leagueSettings.scoring_type;
  seasonModel.firstweek = <number>(<unknown>leagueSettings.start_week);
  seasonModel.lastweek = <number>(<unknown>leagueSettings.end_week);
  seasonModel.tradeenddate = leagueSettings.settings.trade_end_date;
  seasonModel.playoffstartweek = <number>(
    (<unknown>leagueSettings.settings.playoff_start_week)
  );

  const season = await seasonDao.insertSeason(seasonModel);

  return season;

  //   throw `Import Failed: Season already exists!`;
}

export default { importSeason };
