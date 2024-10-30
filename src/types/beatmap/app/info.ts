import type { BeatmapId, Environment, SongId } from "../shared";

export interface ModSettings {
	mappingExtensions: {
		isEnabled: boolean;
		numRows: number;
		numCols: number;
		colWidth: number;
		rowHeight: number;
	};
	customColors: {
		isEnabled: boolean;
		colorLeft: string;
		colorLeftOverdrive?: number;
		colorRight: string;
		colorRightOverdrive?: number;
		envColorLeft: string;
		envColorLeftOverdrive?: number;
		envColorRight: string;
		envColorRightOverdrive?: number;
		obstacleColor: string;
		obstacleColorOverdrive?: number;
	};
}

export interface Beatmap {
	id: BeatmapId;
	noteJumpSpeed: number;
	startBeatOffset: number;
	customLabel?: string;
}

export interface Song {
	id: SongId;
	name: string;
	subName?: string;
	artistName: string;
	mapAuthorName?: string;
	bpm: number;
	offset: number;
	swingAmount?: number;
	swingPeriod?: number;
	previewStartTime: number;
	previewDuration: number;
	environment: Environment;
	songFilename: string;
	coverArtFilename: string;
	difficultiesById: { [key: BeatmapId | string]: Beatmap };
	selectedDifficulty?: BeatmapId;
	createdAt: number;
	lastOpenedAt: number;
	demo?: boolean;
	modSettings: Partial<ModSettings>;
	enabledFastWalls?: boolean;
	enabledLightshow?: boolean;
}
