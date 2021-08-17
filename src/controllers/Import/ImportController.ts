import { Request, Response } from 'express';
import LeagueKeyHelper from '../../Helpers/LeagueKeyHelper';
import leagueDao from '../../services/DataAccess/leagueDao';
import SeasonDao from '../../services/DataAccess/SeasonDao';
import seasonDao from '../../services/DataAccess/SeasonDao';
import seasonImporter from '../../services/Importers/seasonImporter';
import transactionApiSerivce from '../../services/api/YahooApi/transactionApiService';
import leagueTeamApiService from '../../services/api/YahooApi/leagueTeamsApiService';
import ownerDao from '../../services/DataAccess/ownerDao';
import fantasyTeamDao from '../../services/DataAccess/fantasyTeamDao';
import leagueTeamsApiService from '../../services/api/YahooApi/leagueTeamsApiService';
import PlayerDao from '../../services/DataAccess/PlayerDao';
import transactionTypeDao from '../../services/DataAccess/transactionTypeDao';
import fantasyTeamImporter from '../../services/Importers/fantasyTeamImporter';
import transactionDao from '../../services/DataAccess/transactionDao';
import TreamKeyHelper from '../../Helpers/TeamKeyHelper';
import TeamKeyHelper from '../../Helpers/TeamKeyHelper';

export async function ImportLeague(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();
  const leagueKeySplit = league_key.split('.');
  const gamecode = leagueKeySplit[0];
  const yahooleagueId = leagueKeySplit[2];

  const league = await leagueDao.GetOrImportLeague(league_key);

  console.log(league);

  return res.json();
}

export async function ImportSeason(
  req: Request,
  res: Response
): Promise<Response> {
  console.log('here');

  const league_key = req.query.league_key.toString();

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  let season = await seasonDao.GetSeasonByYahooLeagueId(
    <number>(<unknown>leagueKeyParam.league_id)
  );

  if (season == null) {
    season = await seasonImporter.importSeason(league_key);
  }

  console.log(season);

  return res.json();
}

export async function ImportTransactions(
  req: Request,
  res: Response
): Promise<Response> {
  const league_key = req.query.league_key.toString();

  const leagueKeyParam = await LeagueKeyHelper.SplitLeagueKey(league_key);

  await fantasyTeamImporter.ImportAllTeamsForLeague(leagueKeyParam);

  const transactions = await transactionApiSerivce.GetTransactionsByLeagueKey(
    leagueKeyParam
  );

  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);

  const league = await leagueDao.GetOrImportLeague(leagueKeyParam.league_key);
  console.log(transactions.transactions[0].players[0]);

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
        const teamKeyParam = await TreamKeyHelper.SplitTeamKey(
          playerTransaction.transaction.source_team_key
        );

        tradeFromTeam = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
          season.seasonid,
          <number>(<unknown>teamKeyParam.team_key)
        );

        const fantasyTeamKey = await TreamKeyHelper.SplitTeamKey(
          playerTransaction.transaction.destination_team_key
        );

        fantasyTeam = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
          season.seasonid,
          <number>(<unknown>fantasyTeamKey.team_key)
        );
      } else if (transactionType.transactiontypename == 'add') {
        const fantasyTeamKey = await TreamKeyHelper.SplitTeamKey(
          playerTransaction.transaction.destination_team_key
        );

        fantasyTeam = await fantasyTeamDao.GetTeamBySeasonIdAndTeamId(
          season.seasonid,
          <number>(<unknown>fantasyTeamKey.team_key)
        );
      } else if (transactionType.transactiontypename == 'drop') {
        const fantasyTeamKey = await TreamKeyHelper.SplitTeamKey(
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

    // get or import transcation type
    // import transaction
  }

  return res.json();
}
