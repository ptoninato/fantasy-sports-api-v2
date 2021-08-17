import { LeagueKeyParam } from '../../../Types/LeagueKeyParam';
import { TransactionRootObject } from '../../../Types/Transactions';
import YahooFantasy from '../YahooFantasyWrapper';

export async function GetTransactionsByLeagueKey(
  leagueKeyParam: LeagueKeyParam
): Promise<TransactionRootObject> {
  const returnedData = await YahooFantasy.yf.league.transactions(
    leagueKeyParam.league_key
  );
  const transactions = <TransactionRootObject>returnedData;

  return transactions;
}

export default {
  GetTransactionsByLeagueKey
};
