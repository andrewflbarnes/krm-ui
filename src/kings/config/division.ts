export const divisions = ["mixed", "ladies", "board"] as const
export type Division = typeof divisions[number];
