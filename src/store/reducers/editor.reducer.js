/**
 * This reducer holds transient state for the editor.
 * It's persisted for quality-of-life, but really it can be thrown away without
 * much user pain (unless it's every time)
 */

import { produce } from "immer";
import { combineReducers } from "redux";
import { createSelector } from "reselect";

import { BEATS_PER_ZOOM_LEVEL, EVENT_COLORS, EVENT_EDIT_MODES, EVENT_TOOLS, NOTE_TOOLS, ZOOM_LEVEL_MAX, ZOOM_LEVEL_MIN } from "$/constants";
import { ObjectTool, View } from "$/types";
import { floorToNearest } from "$/utils";
import { getCursorPositionInBeats } from "./navigation.reducer";

const initialState = {
	// `notes` covers everything in the /notes editor view:
	// blocks, mines, obstacles
	notes: {
		selectedTool: NOTE_TOOLS[0],
		selectedDirection: 8,
		selectionMode: null, // null | 'select' | 'deselect' | 'delete'.
		defaultObstacleDuration: 4,
		gridPresets: {},
	},
	events: {
		zoomLevel: BEATS_PER_ZOOM_LEVEL[4],
		isLockedToCurrentWindow: false,
		areLasersLocked: false,
		showLightingPreview: false,
		rowHeight: 40,
		backgroundOpacity: 0.85,
		selectedEditMode: EVENT_EDIT_MODES[0],
		selectedBeat: null,
		selectedTool: EVENT_TOOLS[0],
		selectedColor: EVENT_COLORS[0],
		selectionBox: null,
	},
};

function notes(state = initialState.notes, action = undefined) {
	switch (action.type) {
		case "SELECT_NOTE_DIRECTION": {
			const { direction } = action.payload;
			return {
				...state,
				selectedDirection: direction,
			};
		}

		case "SELECT_TOOL": {
			const { view, tool } = action.payload;

			if (view !== View.BEATMAP) {
				return state;
			}

			return {
				...state,
				selectedTool: tool,
			};
		}

		case "SELECT_NEXT_TOOL":
		case "SELECT_PREVIOUS_TOOL": {
			const { view } = action.payload;

			if (view !== View.BEATMAP) {
				return state;
			}

			const currentlySelectedTool = state.selectedTool;

			const incrementBy = action.type === "SELECT_NEXT_TOOL" ? +1 : -1;

			const currentToolIndex = NOTE_TOOLS.indexOf(currentlySelectedTool);
			const nextTool = NOTE_TOOLS[(currentToolIndex + NOTE_TOOLS.length + incrementBy) % NOTE_TOOLS.length];

			return {
				...state,
				selectedTool: nextTool,
			};
		}

		case "SELECT_COLOR": {
			const { view, color } = action.payload;
			if (view !== View.BEATMAP) {
				return state;
			}

			let toolName;
			if (color === "red") {
				toolName = ObjectTool.LEFT_NOTE;
			} else {
				toolName = ObjectTool.RIGHT_NOTE;
			}

			return {
				...state,
				selectedTool: toolName,
			};
		}

		case "START_MANAGING_NOTE_SELECTION": {
			const { selectionMode } = action.payload;
			return {
				...state,
				selectionMode: selectionMode,
			};
		}
		case "FINISH_MANAGING_NOTE_SELECTION": {
			return {
				...state,
				selectionMode: null,
			};
		}

		case "RESIZE_OBSTACLE":
		case "RESIZE_SELECTED_OBSTACLES": {
			const { newBeatDuration } = action.payload;
			return {
				...state,
				defaultObstacleDuration: newBeatDuration,
			};
		}

		case "SAVE_GRID_PRESET": {
			const { grid, presetSlot } = action.payload;

			return {
				...state,
				gridPresets: {
					...state.gridPresets,
					[presetSlot]: grid,
				},
			};
		}

		case "DELETE_GRID_PRESET": {
			const { presetSlot } = action.payload;

			return produce(state, (draftState) => {
				delete draftState.gridPresets[presetSlot];
			});
		}

		default:
			return state;
	}
}

function events(state = initialState.events, action = undefined) {
	switch (action.type) {
		case "MOVE_MOUSE_ACROSS_EVENTS_GRID": {
			const { selectedBeat } = action.payload;
			return {
				...state,
				selectedBeat: selectedBeat,
			};
		}

		case "DRAW_SELECTION_BOX": {
			const { selectionBox } = action.payload;
			return {
				...state,
				selectionBox: selectionBox,
			};
		}
		case "CLEAR_SELECTION_BOX": {
			// Avoid a re-render if we already don't have a selectionBox
			if (!state.selectionBox) {
				return state;
			}

			return {
				...state,
				selectionBox: null,
			};
		}

		case "COMMIT_SELECTION": {
			return {
				...state,
				selectionBox: null,
			};
		}

		case "SELECT_COLOR": {
			const { view, color } = action.payload;

			if (view !== View.LIGHTSHOW) {
				return state;
			}

			return {
				...state,
				selectedColor: color,
			};
		}

		case "SELECT_TOOL": {
			const { view, tool } = action.payload;

			if (view !== View.LIGHTSHOW) {
				return state;
			}

			return {
				...state,
				selectedTool: tool,
			};
		}

		case "SELECT_NEXT_TOOL":
		case "SELECT_PREVIOUS_TOOL": {
			const { view } = action.payload;

			if (view !== View.LIGHTSHOW) {
				return state;
			}

			const currentlySelectedTool = state.selectedTool;

			const incrementBy = action.type === "SELECT_NEXT_TOOL" ? +1 : -1;

			const currentToolIndex = EVENT_TOOLS.indexOf(currentlySelectedTool);
			const nextTool = EVENT_TOOLS[(currentToolIndex + EVENT_TOOLS.length + incrementBy) % EVENT_TOOLS.length];

			return {
				...state,
				selectedTool: nextTool,
			};
		}

		case "SELECT_EVENT_EDIT_MODE": {
			const { editMode } = action.payload;
			return {
				...state,
				selectedEditMode: editMode,
			};
		}

		case "START_MANAGING_EVENT_SELECTION": {
			const { selectionMode, trackId } = action.payload;
			return {
				...state,
				selectionMode: selectionMode,
				selectionModeTrackId: trackId,
			};
		}
		case "FINISH_MANAGING_EVENT_SELECTION": {
			return {
				...state,
				selectionMode: null,
				selectionModeTrackId: null,
			};
		}

		case "ZOOM_IN": {
			const newZoomLevel = Math.min(ZOOM_LEVEL_MAX, state.zoomLevel + 1);
			return {
				...state,
				zoomLevel: newZoomLevel,
			};
		}

		case "ZOOM_OUT": {
			const newZoomLevel = Math.max(ZOOM_LEVEL_MIN, state.zoomLevel - 1);
			return {
				...state,
				zoomLevel: newZoomLevel,
			};
		}

		case "TOGGLE_EVENT_WINDOW_LOCK": {
			return {
				...state,
				isLockedToCurrentWindow: !state.isLockedToCurrentWindow,
			};
		}

		case "TOGGLE_LASER_LOCK": {
			return {
				...state,
				areLasersLocked: !state.areLasersLocked,
			};
		}

		case "TOGGLE_PREVIEW_LIGHTING_IN_View.LIGHTSHOW": {
			return {
				...state,
				showLightingPreview: !state.showLightingPreview,
			};
		}
		case "TWEAK_EVENT_ROW_HEIGHT": {
			const { newHeight } = action.payload;
			return {
				...state,
				rowHeight: newHeight,
			};
		}
		case "TWEAK_EVENT_BACKGROUND_OPACITY": {
			const { newOpacity } = action.payload;
			return {
				...state,
				backgroundOpacity: newOpacity,
			};
		}

		default:
			return state;
	}
}

export const getSelectedNoteTool = (state) => state.editor.notes.selectedTool;
export const getSelectedCutDirection = (state) => state.editor.notes.selectedDirection;

export const getSelectedEventEditMode = (state) => state.editor.events.selectedEditMode;
export const getSelectedEventTool = (state) => state.editor.events.selectedTool;
export const getSelectedEventColor = (state) => state.editor.events.selectedColor;
export const getZoomLevel = (state) => state.editor.events.zoomLevel;
export const getSelectionBox = (state) => state.editor.events.selectionBox;
export const getShowLightingPreview = (state) => state.editor.events.showLightingPreview;
export const getRowHeight = (state) => state.editor.events.rowHeight;
export const getBackgroundOpacity = (state) => state.editor.events.backgroundOpacity;

export const getBeatsPerZoomLevel = (state) => {
	const zoomLevel = getZoomLevel(state);
	return BEATS_PER_ZOOM_LEVEL[zoomLevel];
};

export const getZoomLevelStartBeat = createSelector(getCursorPositionInBeats, getBeatsPerZoomLevel, (cursorPositionInBeats, beatsPerZoomLevel) => {
	return floorToNearest(cursorPositionInBeats, beatsPerZoomLevel);
});
export const getZoomLevelEndBeat = createSelector(getZoomLevelStartBeat, getBeatsPerZoomLevel, (startBeat, beatsPerZoomLevel) => {
	return startBeat + beatsPerZoomLevel;
});

// TODO: Get rid of this silly selector!
export const getStartAndEndBeat = createSelector(getZoomLevelStartBeat, getZoomLevelEndBeat, (startBeat, endBeat) => {
	return { startBeat, endBeat };
});

export const getIsLockedToCurrentWindow = (state) => state.editor.events.isLockedToCurrentWindow;
export const getAreLasersLocked = (state) => state.editor.events.areLasersLocked;

export const getSelectedEventBeat = (state) => state.editor.events.selectedBeat;

export const getDefaultObstacleDuration = (state) => state.editor.notes.defaultObstacleDuration;

export const getGridPresets = (state) => state.editor.notes.gridPresets;

export default combineReducers({ notes, events });
