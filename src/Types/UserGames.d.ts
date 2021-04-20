export interface UserGames {
  guid: string;
  games?: GamesEntity[] | null;
}
export interface GamesEntity {
  game_key: string;
  game_id: string;
  name: string;
  code: string;
  type: string;
  url: string;
  season: string;
  is_registration_over: number;
  is_game_over: number;
  is_offseason: number;
  editorial_season?: string | null;
  picks_status?: string | null;
  contest_group_id?: string | null;
  scenario_generator?: number | null;
}
