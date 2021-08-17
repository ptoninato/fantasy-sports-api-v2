import { TransactionDetails } from './TransactionDetails';

export interface Player {
  player_key: string;
  player_id: string;
  name: PlayerName;
  editorial_team_abbr: string;
  display_position: string;
  position_type: string;
  transaction: TransactionDetails;
}

export interface PlayerName {
  full: string;
  first: string;
  last: string;
  ascii_first: string;
  ascii_last: string;
}
