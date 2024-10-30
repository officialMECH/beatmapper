import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { NOTE_TOOLS } from "$/constants";
import { deleteGridPreset, finishManagingNoteSelection, resizeObstacle, resizeSelectedObstacles, saveGridPreset, selectColor, selectNextTool, selectNoteDirection, selectPreviousTool, selectTool, startManagingNoteSelection } from "$/store/actions";
import { type GridPresets, type ObjectSelectionMode, ObjectTool, View } from "$/types";

const initialState = {
	selectedTool: NOTE_TOOLS[0],
	selectedDirection: 8,
	selectionMode: null as ObjectSelectionMode | null, // null | 'select' | 'deselect' | 'delete'.
	defaultObstacleDuration: 4,
	gridPresets: {} as GridPresets,
};

const slice = createSlice({
	name: "notes",
	initialState: initialState,
	selectors: {
		getSelectedNoteTool: (state) => state.selectedTool,
		getSelectedCutDirection: (state) => state.selectedDirection,
		getNoteSelectionMode: (state) => state.selectionMode,
		getDefaultObstacleDuration: (state) => state.defaultObstacleDuration,
		getGridPresets: (state) => state.gridPresets,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(selectNoteDirection, (state, action) => {
			const { direction } = action.payload;
			return { ...state, selectedDirection: direction };
		});
		builder.addCase(selectTool, (state, action) => {
			const { view, tool } = action.payload;
			if (view !== View.BEATMAP) return state;
			return { ...state, selectedTool: tool as ObjectTool };
		});
		builder.addCase(selectColor, (state, action) => {
			const { view, color } = action.payload;
			if (view !== View.BEATMAP) return state;
			let toolName: ObjectTool;
			if (color === "red") {
				toolName = ObjectTool.LEFT_NOTE;
			} else {
				toolName = ObjectTool.RIGHT_NOTE;
			}
			return { ...state, selectedTool: toolName };
		});
		builder.addCase(startManagingNoteSelection, (state, action) => {
			const { selectionMode } = action.payload;
			return { ...state, selectionMode: selectionMode };
		});
		builder.addCase(finishManagingNoteSelection, (state) => {
			return { ...state, selectionMode: null };
		});
		builder.addCase(saveGridPreset.fulfilled, (state, action) => {
			const { grid, presetSlot } = action.payload;
			return { ...state, gridPresets: { ...state.gridPresets, [presetSlot]: grid } };
		});
		builder.addCase(deleteGridPreset, (state, action) => {
			const { presetSlot } = action.payload;
			delete state.gridPresets[presetSlot];
		});
		builder.addMatcher(isAnyOf(selectNextTool, selectPreviousTool), (state, action) => {
			const { view } = action.payload;
			if (view !== View.BEATMAP) return state;
			const currentlySelectedTool = state.selectedTool;
			const incrementBy = selectNextTool.match(action) ? +1 : -1;
			const currentToolIndex = NOTE_TOOLS.indexOf(currentlySelectedTool);
			const nextTool = NOTE_TOOLS[(currentToolIndex + NOTE_TOOLS.length + incrementBy) % NOTE_TOOLS.length];
			return { ...state, selectedTool: nextTool };
		});
		builder.addMatcher(isAnyOf(resizeObstacle, resizeSelectedObstacles), (state, action) => {
			const { newBeatDuration } = action.payload;
			return { ...state, defaultObstacleDuration: newBeatDuration };
		});
		builder.addDefaultCase((state) => state);
	},
});

export default slice;
