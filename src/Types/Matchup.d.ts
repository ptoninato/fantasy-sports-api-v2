import { StatWinner } from './Scoreboard';

export interface Matchup {
  week: string;
  week_start: string;
  week_end: string;
  status: string;
  is_playoffs: string;
  is_consolation: string;
  is_matchup_recap_available: number;
  matchup_recap_url: string;
  matchup_recap_title: string | boolean;
  matchup_grades: MatchupGrade[];
  is_tied: number;
  winner_team_key: string;
  teams: Team[];
  stat_winners: StatWinner[];
}
