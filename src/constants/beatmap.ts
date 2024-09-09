import { DEFAULT_BLUE, DEFAULT_RED } from "./theme";

export const DIFFICULTIES = ["Easy", "Normal", "Hard", "Expert", "ExpertPlus"] as const;

export const HUMANIZED_DIRECTIONS = ["up", "down", "left", "right", "upLeft", "upRight", "downLeft", "downRight", "face"] as const;

export const TRACK_ID_MAP = {
	laserBack: 0,
	trackNeons: 1,
	laserLeft: 2,
	laserRight: 3,
	primaryLight: 4,
	largeRing: 8,
	smallRing: 9,
	laserSpeedLeft: 12,
	laserSpeedRight: 13,
} as const;

export const TRACK_IDS_ARRAY = ["laserBack", "trackNeons", "laserLeft", "laserRight", "primaryLight", null, null, null, "largeRing", "smallRing", null, null, "laserSpeedLeft", "laserSpeedRight"] as const;

export const LIGHT_EVENT_TYPES = {
	blue: {
		off: 0,
		on: 1,
		flash: 2,
		fade: 3,
	},
	red: {
		off: 0,
		on: 5,
		flash: 6,
		fade: 7,
	},
} as const;

export const LIGHT_EVENTS_ARRAY = ["off", "on", "flash", "fade", null, "on", "flash", "fade"] as const;

export const LIGHTING_TRACKS = ["laserLeft", "laserRight", "laserBack", "primaryLight", "trackNeons"] as const;

export const DEFAULT_NUM_COLS = 4;
export const DEFAULT_NUM_ROWS = 3;
export const DEFAULT_COL_WIDTH = 1;
export const DEFAULT_ROW_HEIGHT = 1;

export const DEFAULT_GRID = {
	numRows: DEFAULT_NUM_ROWS,
	numCols: DEFAULT_NUM_COLS,
	colWidth: DEFAULT_COL_WIDTH,
	rowHeight: DEFAULT_ROW_HEIGHT,
} as const;

export const DEFAULT_NOTE_JUMP_SPEEDS = {
	Easy: 10,
	Normal: 10,
	Hard: 12,
	Expert: 15,
	ExpertPlus: 18,
} as const;

export const DEFAULT_MOD_SETTINGS = {
	customColors: {
		isEnabled: false,
		colorLeft: DEFAULT_RED,
		colorLeftOverdrive: 0,
		colorRight: DEFAULT_BLUE,
		colorRightOverdrive: 0,
		envColorLeft: DEFAULT_RED,
		envColorLeftOverdrive: 0,
		envColorRight: DEFAULT_BLUE,
		envColorRightOverdrive: 0,
		obstacleColor: DEFAULT_RED,
		obstacleColorOverdrive: 0,
	},
	mappingExtensions: {
		isEnabled: false,
		...DEFAULT_GRID,
	},
} as const;

export const COLOR_ELEMENT_IDS = ["colorLeft", "colorRight", "envColorLeft", "envColorRight", "obstacleColor"] as const;

export const COLOR_ELEMENT_DATA = {
	colorLeft: {
		label: "Left Saber",
		maxValue: 5,
	},
	colorRight: {
		label: "Right Saber",
		maxValue: 5,
	},
	envColorLeft: {
		label: "Environment 1",
		maxValue: 3,
	},
	envColorRight: {
		label: "Environment 2",
		maxValue: 3,
	},
	obstacleColor: {
		label: "Obstacles",
		maxValue: 10,
	},
} as const;

export const ENVIRONMENT_DISPLAY_MAP = {
	DefaultEnvironment: "The First (default)",
	Origins: "Origins",
	TriangleEnvironment: "Triangle",
	BigMirrorEnvironment: "Big Mirror",
	NiceEnvironment: "Nice",
	KDAEnvironment: "KDA",
	MonstercatEnvironment: "Monstercat",
	DragonsEnvironment: "Dragons",
	CrabRaveEnvironment: "Crab Rave",
	PanicEnvironment: "Panic",
} as const;
