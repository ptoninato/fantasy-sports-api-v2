import leagueDao from '../../services/DataAccess/leagueDao';
import seasonDao from '../../services/DataAccess/SeasonDao';
import transactionApiSerivce from '../../services/api/YahooApi/transactionApiService';
import fantasyTeamDao from '../../services/DataAccess/fantasyTeamDao';
import PlayerDao from '../../services/DataAccess/PlayerDao';
import transactionTypeDao from '../../services/DataAccess/transactionTypeDao';
import fantasyTeamImporter from '../../services/Importers/fantasyTeamImporter';
import transactionDao from '../../services/DataAccess/transactionDao';
import { LeagueKeyParam } from '../../Types/LeagueKeyParam';
import TeamKeyHelper from '../../Helpers/TeamKeyHelper';

async function ImportTransactionsForLeague(
  leagueKeyParam: LeagueKeyParam
): Promise<void> {
  await fantasyTeamImporter.ImportAllTeamsForLeague(leagueKeyParam);

  const transactions = await transactionApiSerivce.GetTransactionsByLeagueKey(
    leagueKeyParam
  );

  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);

  const league = await leagueDao.GetOrImportLeague(leagueKeyParam.league_key);

  for (let i = 0; i < transactions.transactions.length; i++) {
    const transaction = transactions.transactions[i];

    for (let x = 0; x < transaction.players.length; x++) {
      const playerTransaction = transaction.players[x];

      const player = await PlayerDao.GetOrImportPlayer(
        playerTransaction,
        league
      );

      const transactionType = await transactionTypeDao.GetOrImportTransactionType(
        playerTransaction.transaction.type
      );

      let tradeFromTeam = null;
      let fantasyTeam = null;
      if (transactionType.transactiontypename == 'trade') {
        const teamKeyParam = await TeamKeyHelper.SplitTeamKey(
          playerTransaction.transaction.source_team_key
        );

        tradeFromTeam = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
          season.seasonid,
          <number>(<unknown>teamKeyParam.team_key)
        );

        const fantasyTeamKey = await TeamKeyHelper.SplitTeamKey(
          playerTransaction.transaction.destination_team_key
        );

        fantasyTeam = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
          season.seasonid,
          <number>(<unknown>fantasyTeamKey.team_key)
        );
      } else if (transactionType.transactiontypename == 'add') {
        const fantasyTeamKey = await TeamKeyHelper.SplitTeamKey(
          playerTransaction.transaction.destination_team_key
        );

        fantasyTeam = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
          season.seasonid,
          <number>(<unknown>fantasyTeamKey.team_key)
        );
      } else if (transactionType.transactiontypename == 'drop') {
        const fantasyTeamKey = await TeamKeyHelper.SplitTeamKey(
          playerTransaction.transaction.source_team_key
        );

        fantasyTeam = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
          season.seasonid,
          <number>(<unknown>fantasyTeamKey.team_key)
        );
      }

      const transactionModel = await transactionDao.GetOrImportTransaction(
        season,
        player,
        transaction,
        transactionType,
        fantasyTeam,
        tradeFromTeam
      );
    }
  }
}

export default { ImportTransactionsForLeague };
