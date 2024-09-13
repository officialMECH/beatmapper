export * from "./beatmap";
export * from "./editor";
export * from "./utils";

export type Predicate<Item, Index, Object, Result> = (value: Item, index: Index, object: Object) => Result;
export type ArrayPredicate<T, R> = Predicate<T, number, T[], R>;
