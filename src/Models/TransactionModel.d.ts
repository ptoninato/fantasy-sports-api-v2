export interface TransactionModel {
  transactionid: number;
  seasonid: number;
  fantasyteamid: number;
  tradefromteamid?: number | null;
  playerid: number;
  transactiontypeid: number;
  yahootransactionid: number;
  transactiondate: Date;
}
