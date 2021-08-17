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

  const transactions = await transactionApiSerivce.GetTransactionsByLeagueKey(
    leagueKeyParam
  );

  const season = await seasonDao.GetOrImportSeason(leagueKeyParam);

  const league = await leagueDao.GetOrImportLeague(leagueKeyParam.league_key);
  console.log(transactions.transactions[0].players[0]);

  for (let i = 0; i < 1; i++) {
    const transaction = transactions.transactions[i];

    for (let x = 0; x < transaction.players.length; x++) {
      const yahooPlayer = transaction.players[x];

      console.log(yahooPlayer);

      const player = await PlayerDao.GetOrImportPlayer(yahooPlayer, league);

      console.log(player);
    }

    // get or import transcation type

    // for player in trasaction

    // get or import player
    // will require get or import position type

    // import transaction
  }

  return res.json();
}
