import { Player } from './Player';

export interface Transaction {
  players: Player[];
  transaction_key: string;
  transaction_id: string;
  type: string;
  status: string;
  timestamp: string;
}

export interface TransactionRootObject {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  logo_url: boolean;
  password: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: string;
  scoring_type: string;
  league_type: string;
  renew: string;
  renewed: string;
  iris_group_chat_id: string;
  short_invitation_url: string;
  allow_add_to_dl_extra_pos: number;
  is_pro_league: string;
  is_cash_league: string;
  current_week: string;
  start_week: string;
  start_date: string;
  end_week: string;
  end_date: string;
  is_finished: number;
  game_code: string;
  season: string;
  transactions: Transaction[];
}
