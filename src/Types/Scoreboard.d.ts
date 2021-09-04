import { Matchup } from './Matchup';

export interface MatchupGrade {
  team_key: string;
  grade: string;
}

export interface TeamLogo {
  size: string;
  url: string;
}

export interface RosterAdds {
  coverage_type: string;
  coverage_value: string;
  value: string;
}

export interface Manager {
  manager_id: string;
  nickname: string;
  guid: string;
  is_commissioner: string;
  is_current_login: string;
  image_url: string;
  felo_score: string;
  felo_tier: string;
}

export interface Points {
  coverage_type: string;
  week: string;
  total: string;
}

export interface ProjectedPoints {
  coverage_type: string;
  week: string;
  total: string;
}

export interface Team {
  team_key: string;
  team_id: string;
  name: string;
  is_owned_by_current_login: number;
  url: string;
  team_logos: TeamLogo[];
  waiver_priority: number;
  number_of_moves: string;
  number_of_trades: number;
  roster_adds: RosterAdds;
  clinched_playoffs: number;
  league_scoring_type: string;
  has_draft_grade: number;
  auction_budget_total: string;
  auction_budget_spent: number;
  managers: Manager[];
  points: Points;
  projected_points: ProjectedPoints;
}

// export interface Matchup {
//   week: string;
//   week_start: string;
//   week_end: string;
//   status: string;
//   is_playoffs: string;
//   is_consolation: string;
//   is_matchup_recap_available: number;
//   matchup_recap_url: string;
//   matchup_recap_title: string;
//   matchup_grades: MatchupGrade[];
//   is_tied: number;
//   winner_team_key: string;
//   teams: Team[];
// }

export interface Scoreboard {
  matchups: Matchup[];
  week: string;
}

export interface ScoreboardRootObject {
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
  scoreboard: Scoreboard;
}
