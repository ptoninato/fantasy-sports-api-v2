import { StatCategory } from './StateCategory';
import { League } from './League';
import { RosterPosition } from './RosterPosition';

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
