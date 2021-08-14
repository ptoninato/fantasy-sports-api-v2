import { Manager } from './Manager';

export interface Team {
  team_key: string;
  team_id: string;
  name: string;
  url: string;
  team_logo: string;
  waiver_priority: number;
  number_of_moves: string;
  number_of_trades: string | int;
  clinched_playoffs: number;
  managers: Manager[];
}
