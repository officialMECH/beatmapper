import type { Accept } from "../utils";

export type EntityId = string;
export type SongId = EntityId;
export type BeatmapId = Accept<Difficulty, EntityId>;

export type Difficulty = "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";

export type Environment = Accept<"DefaultEnvironment" | "BigMirrorEnvironment" | "TriangleEnvironment" | "NiceEnvironment" | "DragonsEnvironment", string>;
