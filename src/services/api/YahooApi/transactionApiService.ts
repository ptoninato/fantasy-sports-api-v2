import { TransactionRootObject } from '../../../Types/Transactions';
import YahooFantasy from '../YahooFantasyWrapper';

export async function GetTransactionsByLeagueKey(
  league_key: string
): Promise<TransactionRootObject> {
  const returnedData = await YahooFantasy.yf.league.transactions(league_key);
  const transactions = <TransactionRootObject>returnedData;

  return transactions;
}

export default {
  GetTransactionsByLeagueKey
};
