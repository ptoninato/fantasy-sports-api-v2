import { StatCategory } from './StateCategory';
import { League } from './League';
import { RosterPosition } from './RosterPosition';

export interface LeagueSettingsRootObject {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  logo_url: string;
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
  settings: LeagueSettings;
}

export interface LeagueSettings {
  draft_type: string;
  is_auction_draft: string;
  scoring_type: string;
  persistent_url: string;
  uses_playoff: string;
  has_playoff_consolation_games: boolean;
  playoff_start_week: string;
  uses_playoff_reseeding: number;
  uses_lock_eliminated_teams: number;
  num_playoff_teams: string;
  num_playoff_consolation_teams: number;
  uses_roster_import: string;
  roster_import_deadline: string;
  waiver_type: string;
  waiver_rule: string;
  uses_faab: string;
  draft_time: string;
  post_draft_players: string;
  max_teams: string;
  waiver_time: string;
  trade_end_date: string;
  trade_ratify_type: string;
  trade_reject_time: string;
  player_pool: string;
  cant_cut_list: string;
  is_publicly_viewable: string;
  roster_positions: RosterPosition[];
  stat_categories: StatCategory[];
  max_adds: string;
  season_type: string;
  min_innings_pitched: string;
  league: League;
}
