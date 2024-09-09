import type { Accept } from "../../utils";

export type SaberColor = "red" | "blue";

export type Direction = "upLeft" | "up" | "upRight" | "right" | "downRight" | "down" | "downLeft" | "left" | "face";

export type ObstacleType = "wall" | "ceiling" | "extension";

export type LightingTrackId = "laserLeft" | "laserRight" | "laserBack" | "primaryLight" | "trackNeons";
export type RingTrackId = "largeRing" | "smallRing";
export type LaserSpeedTrackId = "laserSpeedLeft" | "laserSpeedRight";
export type TrackId = LightingTrackId | RingTrackId | LaserSpeedTrackId;

export type LightingEventType = "on" | "off" | "flash" | "fade";
export type RingEventType = "rotate";
export type LaserSpeedEventType = "change-speed";
export type EventType = Accept<LightingEventType | RingEventType | LaserSpeedEventType, string>;

export type EventColorType = "red" | "blue";
