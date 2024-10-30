import type { Direction } from "../shared";

export interface Note {
	_time: number;
	_lineIndex: number;
	_lineLayer: number;
	_type: number;
	_cutDirection: Direction;
}

export interface Obstacle {
	_time: number;
	_duration: number;
	_type: number;
	_lineIndex: number;
	_width: number;
}
