export interface SeasonModel {
  seasonid: number;
  leagueid: number;
  gamecodeid: number;
  yahooleagueid: number;
  startdate: DateTime;
  enddate: DateTime;
  seasonyear: number;
  scoringtype: string;
  firstweek: number;
  lastweek: number;
  tradeenddate: DateTime;
  playoffstartweek: number;
}
