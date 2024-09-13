export * from "./shared";

export interface IGrid {
	numCols: number;
	numRows: number;
	colWidth: number;
	rowHeight: number;
}

export type GridPresets = Record<string, IGrid>;
