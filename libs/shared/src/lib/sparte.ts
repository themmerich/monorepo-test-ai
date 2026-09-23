export const SPARTEN = ['Leben', 'Kranken', 'Sach', 'KFZ'] as const;

export type Sparte = (typeof SPARTEN)[number];
