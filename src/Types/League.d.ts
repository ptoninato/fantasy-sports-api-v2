import {
  WeeklyDeadline,
  LeagueType,
  ScoringType,
  DraftStatus,
  Password
} from './Enums';

export interface League {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  logo_url: boolean | string;
  password?: Password;
  draft_status: DraftStatus;
  num_teams: number;
  edit_key: string;
  weekly_deadline: WeeklyDeadline;
  league_update_timestamp: string;
  scoring_type: ScoringType;
  league_type: LeagueType;
  renew: string;
  renewed: string;
  iris_group_chat_id: string;
  short_invitation_url?: boolean | string;
  allow_add_to_dl_extra_pos: number;
  is_pro_league: string;
  is_cash_league: string;
  current_week?: number | string;
  start_week?: string;
  start_date: Date;
  end_week?: string;
  end_date: Date;
  is_finished?: number;
  game_code: Code;
  season: string;
}
