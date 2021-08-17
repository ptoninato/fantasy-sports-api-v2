import pool from '../../database/db';
import { FantasyTeamModel } from '../../Models/FantasyTeamModel';
import { PlayerModel } from '../../Models/PlayerModel';
import { SeasonModel } from '../../Models/SeasonModel';
import { TransactionModel } from '../../Models/TransactionModel';
import { TransactionTypeModel } from '../../Models/TransactionTypeModel';
import { Transaction } from '../../Types/Transactions';

const GetTransactionBySesonPlayerAndYahooTransactionId = async (
  season: SeasonModel,
  player: PlayerModel,
  transaction: Transaction
): Promise<TransactionModel> => {
  try {
    const query = `select * from transaction where seasonid = '${season.seasonid}' and playerid = '${player.playerid}' and yahootransactionid = ${transaction.transaction_id} limit 1`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const transaction = result.rows[0] as TransactionModel;
      return transaction;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const GetOrImportTransaction = async (
  season: SeasonModel,
  player: PlayerModel,
  transaction: Transaction,
  transactionType: TransactionTypeModel,
  fantasyTeam: FantasyTeamModel,
  tradefromteam: FantasyTeamModel | null
): Promise<TransactionModel> => {
  try {
    let transactionModel = await GetTransactionBySesonPlayerAndYahooTransactionId(
      season,
      player,
      transaction
    );

    if (transactionModel == null) {
      transactionModel = await InsertTransaction(
        season,
        player,
        transaction,
        fantasyTeam,
        tradefromteam,
        transactionType
      );
    }

    return transactionModel;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const InsertTransaction = async (
  season: SeasonModel,
  player: PlayerModel,
  transaction: Transaction,
  fantasyTeam: FantasyTeamModel,
  tradefromteam: FantasyTeamModel | null,
  transactionType: TransactionTypeModel
): Promise<TransactionModel> => {
  try {
    const tradefromteamId =
      tradefromteam != null ? tradefromteam.fantasyteamid : null;
    const transactionDate = await new Date(
      Number(transaction.timestamp) * 1000
    ).toISOString();
    const query = `INSERT INTO public."transaction"
(seasonid, fantasyteamid, tradefromteamid, playerid, transactiontypeid, yahootransactionid, transactiondate)
VALUES(${season.seasonid}, ${fantasyTeam.fantasyteamid}, ${tradefromteamId}, ${player.playerid}, ${transactionType.transactiontypeid}, ${transaction.transaction_id}, '${transactionDate}') RETURNING *;
`;

    const result = await pool.query(query);

    if (result.rowCount == 1) {
      const transaction = result.rows[0] as TransactionModel;
      return transaction;
    }

    return null;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export default { GetOrImportTransaction };
