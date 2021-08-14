import { Team } from './Team';

export interface LeagueTeamsRootObject {
  league_key: string;
  league_id: string;
  name: string;
  url: string;
  draft_status: string;
  num_teams: number;
  edit_key: string;
  weekly_deadline: string;
  league_update_timestamp: string;
  scoring_type: string;
  league_type: string;
  renew: string;
  renewed: string;
  short_invitation_url: string;
  is_pro_league: string;
  current_week: string;
  start_week: string;
  start_date: string;
  end_week: string;
  end_date: string;
  is_finished: number;
  teams: Team[];
}
