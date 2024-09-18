export * from "./shared";

export interface IGrid {
	numCols: number;
	numRows: number;
	colWidth: number;
	rowHeight: number;
}

export type GridPresets = Record<string, IGrid>;

export type ISelectionBox = Pick<DOMRect, "left" | "right" | "top" | "bottom" | "height" | "width">;
export type ISelectionBoxInBeats = {
	startBeat: number;
	endBeat: number;
	startTrackIndex: number;
	endTrackIndex: number;
};
