import { League } from './UserGames';
import { Code, Name, Type } from './Enums';

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
