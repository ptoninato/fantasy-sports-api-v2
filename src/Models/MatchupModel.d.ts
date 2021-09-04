export interface MatchupModel {
  matchupid: number;
  fantasyteamid1: number;
  fantasyteamid2: number;
  winningteamid: number;
  isplayoffs: boolean;
  isconsolation: boolean;
  seasonid: number;
  matchuprecap: string;
  matchuprecaptitle: string;
  seasonweekid: number;
  losingteamid: number;
  tie: boolean;
}
