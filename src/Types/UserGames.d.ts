export interface UserGames {
  guid: string;
  games: Game[];
}

export interface Game {
  game_key: string;
  game_id: string;
  name: Name;
  code: Code;
  type: Type;
  url: string;
  season: string;
  is_registration_over: number;
  is_game_over: number;
  is_offseason: number;
  leagues: Array<League[]>;
}

export const enum Code {
  Mlb = 'mlb',
  Nfl = 'nfl'
}

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

export enum DraftStatus {
  Postdraft = 'postdraft'
}

export enum LeagueType {
  Private = 'private',
  Public = 'public'
}

export enum Password {
  Empty = '',
  Theleague = 'theleague'
}

export enum ScoringType {
  Head = 'head',
  Headpoint = 'headpoint',
  Roto = 'roto'
}

export enum WeeklyDeadline {
  Empty = '',
  Intraday = 'intraday'
}

export enum Name {
  Baseball = 'Baseball',
  Football = 'Football'
}

export enum Type {
  Full = 'full'
}
