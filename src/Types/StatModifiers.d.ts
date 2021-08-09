export interface StatModifier {
  stat_id: number;
  value: string;
}

export interface StatModifierList {
  stat: StatModifier;
}

export interface StatModifiers {
  stats: StatModifierList[];
}
