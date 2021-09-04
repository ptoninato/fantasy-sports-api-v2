export interface Matchup {
  week: string;
  week_start: string;
  week_end: string;
  status: string;
  is_playoffs: string;
  is_consolation: string;
  is_tied: number;
  winner_team_key: string;
  stat_winners: StatWinner[];
  teams: Team[];
}
