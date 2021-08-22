import { StatPositionType } from './StatPositionType';

export interface StatCategory {
  stat_id: number;
  enabled: bool;
  name: string;
  display_name: string;
  sort_order: string;
  position_type: string;
  stat_position_types: StatPositionType[];
  is_only_display_stat: string;
}
