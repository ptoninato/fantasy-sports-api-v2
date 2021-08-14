export interface Fantasyteam {
  fantasyteamid: number;
  leagueid: number;
  seasonid: number;
  ownerid: number;
  yahooteamid: number;
  teamname: string;
  teamurl: string;
  teamlogo: string;
  moves: number;
  trades: number;
  rank: number;
  wins?: number;
  losses?: number;
  ties?: number;
  percentage?: number;
  gamesback?: number;
  rosteradds: number;
  gradeid?: number;
  clinchedplayoffs: boolean;
  playoffseed?: number;
  pointsfor?: number;
  pointsagainst?: number;
  pointsback?: any;
}
