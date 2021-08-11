import leagueDao from '../DataAccess/leagueDao';
import { LeagueModel } from '../../Models/LeagueModel';
import gameCodeTypeDAO from '../DataAccess/gameCodeTypeDao';
import leagueApiService from '../api/YahooApi/leagueApiService';
import gameApiService from '../api/YahooApi/gameApiService';

async function importLeague(league_key: string): Promise<LeagueModel> {
  const leagueKeySplit = league_key.split('.');

  const leagueMetadata = await leagueApiService.getLeagueMetaDataByLeagueKey(
    league_key
  );
  const gameMetaData = await gameApiService.getGameMetaDataByGameKey(
    leagueKeySplit[0]
  );
  const gameCodeType = await gameCodeTypeDAO.getOrInsertGameCodeTypeByLeagueKeyAndGameCode(
    gameMetaData.code,
    gameMetaData.name
  );

  const existingLeague = await leagueDao.GetLeagueByLeagueName(
    leagueMetadata.name
  );

  if (existingLeague == null) {
    const league = await leagueDao.insertLeague(
      leagueMetadata.name,
      gameCodeType.gamecodetypeid
    );
    return league;
  }

  throw `Import Failed: League ${leagueMetadata.name} already exists!`;
}

export default { importLeague };
