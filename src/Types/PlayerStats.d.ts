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

export interface Stat {
  stat_id: string;
  value: string;
}

export interface Stats {
  coverage_type: string;
  coverage_value: string;
  stats: Stat[];
}

export interface PlayerStats {
  player_key: string;
  player_id: string;
  name: Name;
  editorial_player_key: string;
  editorial_team_key: string;
  editorial_team_full_name: string;
  editorial_team_abbr: string;
  bye_weeks: ByeWeeks;
  uniform_number: string;
  display_position: string;
  headshot: Headshot;
  image_url: string;
  is_undroppable: string;
  position_type: string;
  eligible_positions: string[];
  stats: Stats;
}
