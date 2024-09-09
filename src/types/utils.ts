// biome-ignore lint/complexity/noBannedTypes: acceptable (heh) use case
type Acceptable<As> = As & Readonly<Object>;
/** Creates a loose type (one that accepts a wider definition while providing autocomplete for known values). */
export type Accept<T, As> = T | Acceptable<As>;
