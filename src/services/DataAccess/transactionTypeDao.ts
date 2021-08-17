import pool from '../../database/db';
import { TransactionTypeModel } from '../../Models/TransactionTypeModel';

async function GetOrImportTransactionType(
  transactiontypename: string
): Promise<TransactionTypeModel> {
  let query = `select * from transactiontype where transactiontypename = '${transactiontypename}' limit 1`;

  let result = await pool.query(query);

  if (result.rowCount == 0) {
    query = `INSERT INTO public.transactiontype
(transactiontypename)
VALUES('${transactiontypename}') RETURNING *`;
    result = await pool.query(query);
  }

  const transactionTypeModel = result.rows[0] as TransactionTypeModel;

  return transactionTypeModel;
}

export default {
  GetOrImportTransactionType
};
