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

export interface Name {
  full: string;
  first: string;
  last: string;
  ascii_first: string;
  ascii_last: string;
}

export interface ByeWeeks {
  week: string;
}

export interface Headshot {
  url: string;
  size: string;
}

export interface Roster {
  player_key: string;
  player_id: string;
  name: Name;
  editorial_player_key: string;
  editorial_team_key: string;
  editorial_team_full_name: string;
  editorial_team_abbr: string;
  bye_weeks: ByeWeeks;
  uniform_number: any;
  display_position: string;
  headshot: Headshot;
  image_url: string;
  is_undroppable: string;
  position_type: string;
  primary_position: string;
  eligible_positions: string[];
  has_player_notes: number;
  player_notes_last_timestamp: number;
  selected_position: string;
  status: string;
  status_full: string;
  injury_note: string;
  has_recent_player_notes?: number;
}

export interface RosterRootObject {
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
  roster: Roster[];
}
