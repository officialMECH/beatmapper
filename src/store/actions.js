import { v1 as uuid } from "uuid";

import { HIGHEST_PRECISION } from "$/constants";
import { getNewBookmarkColor } from "$/helpers/bookmarks.helpers";
import { View } from "$/types";
import { roundAwayFloatingPointNonsense, roundToNearest } from "$/utils";
import { getSortedBookmarksArray } from "./reducers/bookmarks.reducer";
import { getCopiedData } from "./reducers/clipboard.reducer";
import { getSelection } from "./reducers/editor-entities.reducer";
import { getAllEventsAsArray } from "./reducers/editor-entities.reducer/events-view.reducer";
import { getNotes, getObstacles } from "./reducers/editor-entities.reducer/notes-view.reducer";
import { getSelectedCutDirection, getSelectedEventBeat, getSelectedNoteTool, getStartAndEndBeat } from "./reducers/editor.reducer";
import { getCursorPositionInBeats, getIsPlaying, getSnapTo } from "./reducers/navigation.reducer";
import { getGridSize, getSelectedSong } from "./reducers/songs.reducer";
import { getStickyMapAuthorName } from "./reducers/user.reducer";

export const loadDemoSong = () => ({
	type: "LOAD_DEMO_SONG",
});

export const createNewSong =
	({ coverArtFilename, coverArtFile, songFilename, songFile, songId, name, subName, artistName, bpm, offset, selectedDifficulty }) =>
	(dispatch, getState) => {
		const state = getState();

		const mapAuthorName = getStickyMapAuthorName(state);

		return dispatch({
			type: "CREATE_NEW_SONG",
			payload: { coverArtFilename, coverArtFile, songFilename, songFile, songId, name, subName, artistName, bpm, offset, selectedDifficulty, mapAuthorName, createdAt: Date.now(), lastOpenedAt: Date.now() },
		});
	};

export const updateSongDetails = ({ songId, songData }) => ({
	type: "UPDATE_SONG_DETAILS",
	payload: { songId, ...songData },
});

export const loadDemoMap = () => ({
	type: "LOAD_DEMO_MAP",
});

export const startImportingSong = () => ({
	type: "START_IMPORTING_SONG",
});

export const cancelImportingSong = () => ({
	type: "CANCEL_IMPORTING_SONG",
});

export const importExistingSong = ({ songData }) => ({
	type: "IMPORT_EXISTING_SONG",
	payload: { songData, createdAt: Date.now(), lastOpenedAt: Date.now() },
});

export const changeSelectedDifficulty = ({ songId, difficulty }) => ({
	type: "CHANGE_SELECTED_DIFFICULTY",
	payload: { songId, difficulty },
});

export const createDifficulty = ({ difficulty, afterCreate }) => ({
	type: "CREATE_DIFFICULTY",
	payload: { difficulty, afterCreate },
});

export const copyDifficulty = ({ songId, fromDifficultyId, toDifficultyId, afterCopy }) => ({
	type: "COPY_DIFFICULTY",
	payload: { songId, fromDifficultyId, toDifficultyId, afterCopy },
});

export const startLoadingSong = ({ songId, difficulty }) => ({
	type: "START_LOADING_SONG",
	payload: { songId, difficulty },
});

export const loadBeatmapEntities = ({ notes, events, obstacles, bookmarks }) => ({
	type: "LOAD_BEATMAP_ENTITIES",
	payload: { notes, events, obstacles, bookmarks },
});

export const finishLoadingSong = ({ song, waveformData }) => ({
	type: "FINISH_LOADING_SONG",
	payload: { song, waveformData, lastOpenedAt: Date.now() },
});

export const reloadWaveform = ({ waveformData }) => ({
	type: "RELOAD_WAVEFORM",
	payload: { waveformData },
});

export const startPlaying = () => ({
	type: "START_PLAYING",
});

export const pausePlaying = () => ({
	type: "PAUSE_PLAYING",
});

export const stopPlaying = ({ offset }) => ({
	type: "STOP_PLAYING",
	payload: { offset },
});

export const togglePlaying = () => ({
	type: "TOGGLE_PLAYING",
});

export const cutSelection =
	({ view }) =>
	(dispatch, getState) => {
		const selection = getSelection(getState(), view);

		return dispatch({
			type: "CUT_SELECTION",
			payload: { view, data: selection },
		});
	};

export const copySelection =
	({ view }) =>
	(dispatch, getState) => {
		const selection = getSelection(getState(), view);

		return dispatch({
			type: "COPY_SELECTION",
			payload: { view, data: selection },
		});
	};

export const pasteSelection =
	({ view }) =>
	(dispatch, getState) => {
		const state = getState();

		const data = getCopiedData(state);

		// If there's nothing copied, do nothing
		if (!data) {
			return;
		}

		// When pasting in notes view, we want to paste at the cursor position, where
		// the song is currently playing. For the events view, we want to paste it
		// where the mouse cursor is, the selected beat.
		const pasteAtBeat = view === View.BEATMAP ? getCursorPositionInBeats(state) : getSelectedEventBeat(state);

		// Every entity that has an ID (obstacles, events) needs a unique ID, we
		// shouldn't blindly copy it over.
		const uniqueData = data.map((item) => {
			if (typeof item.id === "undefined") {
				return item;
			}

			return {
				...item,
				id: uuid(),
			};
		});

		return dispatch({
			type: "PASTE_SELECTION",
			payload: { view, data: uniqueData, pasteAtBeat },
		});
	};

export const adjustCursorPosition = ({ newCursorPosition }) => ({
	type: "ADJUST_CURSOR_POSITION",
	payload: { newCursorPosition },
});

export const createBookmark =
	({ name, view }) =>
	(dispatch, getState) => {
		const state = getState();

		const existingBookmarks = getSortedBookmarksArray(state);
		const color = getNewBookmarkColor(existingBookmarks);

		// For the notes view, we want to use the cursorPosition to figure out when to
		// create the bookmark for.
		// For the events view, we want it to be based on the mouse position.
		const beatNum = view === View.BEATMAP ? getCursorPositionInBeats(state) : getSelectedEventBeat(state);

		return dispatch({
			type: "CREATE_BOOKMARK",
			payload: { beatNum, name, color },
		});
	};

export const deleteBookmark = ({ beatNum }) => ({
	type: "DELETE_BOOKMARK",
	payload: { beatNum },
});

export const clickPlacementGrid =
	({ rowIndex, colIndex }) =>
	(dispatch, getState) => {
		const state = getState();

		const selectedDirection = getSelectedCutDirection(state);
		const selectedTool = getSelectedNoteTool(state);
		const cursorPositionInBeats = getCursorPositionInBeats(state);

		const adjustedCursorPosition = adjustNoteCursorPosition(cursorPositionInBeats, state);

		dispatch({
			type: "CLICK_PLACEMENT_GRID",
			payload: { rowIndex, colIndex, cursorPositionInBeats: adjustedCursorPosition, selectedDirection, selectedTool },
		});
	};

export const clearCellOfNotes = ({ rowIndex, colIndex }) => {
	return (dispatch, getState) => {
		const cursorPositionInBeats = getCursorPositionInBeats(getState());

		dispatch({
			type: "CLEAR_CELL_OF_NOTES",
			payload: { rowIndex, colIndex, cursorPositionInBeats },
		});
	};
};

export const setBlockByDragging =
	({ direction, rowIndex, colIndex, selectedTool }) =>
	(dispatch, getState) => {
		const state = getState();

		const selectedTool = getSelectedNoteTool(state);
		const cursorPositionInBeats = getCursorPositionInBeats(state);

		const adjustedCursorPosition = adjustNoteCursorPosition(cursorPositionInBeats, state);

		return dispatch({
			type: "SET_BLOCK_BY_DRAGGING",
			payload: { direction, rowIndex, colIndex, cursorPositionInBeats: adjustedCursorPosition, selectedTool },
		});
	};

export const zoomWaveform = ({ amount }) => ({
	type: "ZOOM_WAVEFORM",
	payload: { amount },
});

export const scrubWaveform = ({ newOffset }) => ({
	type: "SCRUB_WAVEFORM",
	payload: { newOffset },
});

export const scrubEventsHeader = ({ selectedBeat }) => ({
	type: "SCRUB_EVENTS_HEADER",
	payload: { selectedBeat },
});

export const scrollThroughSong = ({ direction }) => ({
	type: "SCROLL_THROUGH_SONG",
	payload: { direction },
});

export const skipToStart = () => (dispatch, getState) => {
	const state = getState();
	const song = getSelectedSong(state);
	const offset = song.offset || 0;

	dispatch({
		type: "SKIP_TO_START",
		payload: { offset },
	});
};

export const skipToEnd = () => ({
	type: "SKIP_TO_END",
});

export const changeSnapping = ({ newSnapTo }) => ({
	type: "CHANGE_SNAPPING",
	payload: { newSnapTo },
});

export const incrementSnapping = () => ({
	type: "INCREMENT_SNAPPING",
});

export const decrementSnapping = () => ({
	type: "DECREMENT_SNAPPING",
});

export const selectNoteDirection = ({ direction }) => ({
	type: "SELECT_NOTE_DIRECTION",
	payload: { direction },
});

export const selectTool = ({ view, tool }) => ({
	type: "SELECT_TOOL",
	payload: { view, tool },
});

export const selectNextTool = ({ view }) => ({
	type: "SELECT_NEXT_TOOL",
	payload: { view },
});

export const selectPreviousTool = ({ view }) => ({
	type: "SELECT_PREVIOUS_TOOL",
	payload: { view },
});

export const clickNote = ({ clickType, time, lineLayer, lineIndex }) => ({
	type: "CLICK_NOTE",
	payload: { clickType, time, lineLayer, lineIndex },
});

export const mouseOverNote = ({ time, lineLayer, lineIndex }) => ({
	type: "MOUSE_OVER_NOTE",
	payload: { time, lineLayer, lineIndex },
});

export const toggleNoteColor = ({ time, lineLayer, lineIndex }) => ({
	type: "TOGGLE_NOTE_COLOR",
	payload: { time, lineLayer, lineIndex },
});

export const selectNote = ({ time, lineLayer, lineIndex }) => ({
	type: "SELECT_NOTE",
	payload: { time, lineLayer, lineIndex },
});

export const deselectNote = ({ time, lineLayer, lineIndex }) => ({
	type: "DESELECT_NOTE",
	payload: { time, lineLayer, lineIndex },
});

export const selectObstacle = ({ id }) => ({
	type: "SELECT_OBSTACLE",
	payload: { id },
});

export const deselectObstacle = ({ id }) => ({
	type: "DESELECT_OBSTACLE",
	payload: { id },
});

export const deselectAll = ({ view }) => ({
	type: "DESELECT_ALL",
	payload: { view },
});

export const deselectAllOfType = ({ itemType }) => ({
	type: "DESELECT_ALL_OF_TYPE",
	payload: { itemType },
});

export const selectAll =
	({ view }) =>
	(dispatch, getState) => {
		const state = getState();

		// For the events view, we don't actually want to select EVERY note. We
		// only want to select what is visible in the current frame.
		let metadata = null;

		if (view === View.LIGHTSHOW) {
			const { startBeat, endBeat } = getStartAndEndBeat(state);
			metadata = { startBeat, endBeat };
		}

		dispatch({
			type: "SELECT_ALL",
			payload: { view, metadata },
		});
	};

export const toggleSelectAll =
	({ view }) =>
	(dispatch, getState) => {
		const state = getState();

		let anythingSelected;

		if (view === View.BEATMAP) {
			const notes = getNotes(state);
			const obstacles = getObstacles(state);

			const anyNotesSelected = notes.some((n) => n.selected);
			const anyObstaclesSelected = obstacles.some((s) => s.selected);

			anythingSelected = anyNotesSelected || anyObstaclesSelected;
		} else if (view === View.LIGHTSHOW) {
			const events = getAllEventsAsArray(state);

			anythingSelected = events.some((e) => e.selected);
		}

		if (anythingSelected) {
			dispatch(deselectAll({ view }));
		} else {
			dispatch(selectAll({ view }));
		}
	};

export const selectAllInRange = ({ view, start, end }) => ({
	type: "SELECT_ALL_IN_RANGE",
	payload: { view, start, end },
});

export const deleteNote = ({ time, lineLayer, lineIndex }) => ({
	type: "DELETE_NOTE",
	payload: { time, lineLayer, lineIndex },
});

export const bulkDeleteNote = ({ time, lineLayer, lineIndex }) => ({
	type: "BULK_DELETE_NOTE",
	payload: { time, lineLayer, lineIndex },
});

export const deleteSelectedNotes = () => ({
	type: "DELETE_SELECTED_NOTES",
});

export const startManagingNoteSelection = ({ selectionMode }) => ({
	type: "START_MANAGING_NOTE_SELECTION",
	payload: { selectionMode },
});

export const finishManagingNoteSelection = () => ({
	type: "FINISH_MANAGING_NOTE_SELECTION",
});

export const moveMouseAcrossEventsGrid = ({ selectedBeat }) => ({
	type: "MOVE_MOUSE_ACROSS_EVENTS_GRID",
	payload: { selectedBeat },
});

export const downloadMapFiles = ({ version = 2, songId }) => ({
	type: "DOWNLOAD_MAP_FILES",
	payload: { version, songId },
});

export const updateBeatmapMetadata = ({ songId, difficulty, noteJumpSpeed, startBeatOffset, customLabel }) => ({
	type: "UPDATE_BEATMAP_METADATA",
	payload: { songId, difficulty, noteJumpSpeed, startBeatOffset, customLabel },
});

export const deleteBeatmap = ({ songId, difficulty }) => ({
	type: "DELETE_BEATMAP",
	payload: { songId, difficulty },
});

export const updatePlaybackSpeed = ({ playbackRate }) => ({
	type: "UPDATE_PLAYBACK_SPEED",
	payload: { playbackRate },
});

export const updateBeatDepth = ({ beatDepth }) => ({
	type: "UPDATE_BEAT_DEPTH",
	payload: { beatDepth },
});

export const updateVolume = ({ volume }) => ({
	type: "UPDATE_VOLUME",
	payload: { volume },
});

export const createNewObstacle =
	({ obstacle }) =>
	(dispatch, getState) => {
		const state = getState();

		const snapTo = getSnapTo(state);
		let cursorPositionInBeats = getCursorPositionInBeats(state);

		cursorPositionInBeats = roundAwayFloatingPointNonsense(cursorPositionInBeats, snapTo);

		dispatch({
			type: "CREATE_NEW_OBSTACLE",
			payload: {
				obstacle: {
					...obstacle,
					id: uuid(),
					beatStart: cursorPositionInBeats,
				},
			},
		});
	};

export const deleteObstacle = ({ id }) => ({
	type: "DELETE_OBSTACLE",
	payload: { id },
});

export const resizeObstacle = ({ id, newBeatDuration }) => ({
	type: "RESIZE_OBSTACLE",
	payload: { id, newBeatDuration },
});

export const resizeSelectedObstacles = ({ newBeatDuration }) => ({
	type: "RESIZE_SELECTED_OBSTACLES",
	payload: { newBeatDuration },
});

export const undoNotes = () => ({
	type: "UNDO_NOTES",
});
export const redoNotes = () => ({
	type: "REDO_NOTES",
});
export const undoEvents = () => ({
	type: "UNDO_EVENTS",
});
export const redoEvents = () => ({
	type: "REDO_EVENTS",
});

export const deleteSong = ({ songId }) => ({
	type: "DELETE_SONG",
	payload: { songId },
});

export const toggleNoteTick = () => ({
	type: "TOGGLE_NOTE_TICK",
});

export const leaveEditor = () => ({
	type: "LEAVE_EDITOR",
});

export const swapSelectedNotes = ({ axis }) => ({
	type: "SWAP_SELECTED_NOTES",
	payload: { axis },
});

export const nudgeSelection =
	({ direction, view }) =>
	(dispatch, getState) => {
		const state = getState();
		const snapTo = getSnapTo(state);

		dispatch({
			type: "NUDGE_SELECTION",
			payload: { view, direction, amount: snapTo },
		});
	};

export const jumpToBeat = ({ beatNum, pauseTrack, animateJump }) => ({
	type: "JUMP_TO_BEAT",
	payload: { beatNum, pauseTrack, animateJump },
});

export const seekForwards = ({ view }) => ({
	type: "SEEK_FORWARDS",
	payload: { view },
});

export const seekBackwards = ({ view }) => ({
	type: "SEEK_BACKWARDS",
	payload: { view },
});

export const placeEvent = ({ trackId, beatNum, eventType, eventColorType, eventLaserSpeed, areLasersLocked }) => {
	return {
		type: "PLACE_EVENT",
		payload: { id: uuid(), trackId, beatNum, eventType, eventColorType, eventLaserSpeed, areLasersLocked },
	};
};
export const changeLaserSpeed = ({ trackId, beatNum, speed, areLasersLocked }) => {
	return {
		type: "CHANGE_LASER_SPEED",
		payload: { id: uuid(), trackId, beatNum, speed, areLasersLocked },
	};
};

export const deleteEvent = ({ id, trackId, areLasersLocked }) => ({
	type: "DELETE_EVENT",
	payload: { id, trackId, areLasersLocked },
});

export const bulkDeleteEvent = ({ id, trackId, areLasersLocked }) => ({
	type: "BULK_DELETE_EVENT",
	payload: { id, trackId, areLasersLocked },
});

export const deleteSelectedEvents = () => ({
	type: "DELETE_SELECTED_EVENTS",
});

export const selectEvent = ({ id, trackId }) => ({
	type: "SELECT_EVENT",
	payload: { id, trackId },
});

export const deselectEvent = ({ id, trackId }) => ({
	type: "DESELECT_EVENT",
	payload: { id, trackId },
});

export const selectColor = ({ view, color }) => ({
	type: "SELECT_COLOR",
	payload: { view, color },
});

export const switchEventColor = ({ id, trackId }) => ({
	type: "SWITCH_EVENT_COLOR",
	payload: { id, trackId },
});

export const selectEventColor = ({ color }) => selectColor({ view: View.LIGHTSHOW, color });

export const selectEventEditMode = ({ editMode }) => ({
	type: "SELECT_EVENT_EDIT_MODE",
	payload: { editMode },
});

export const zoomIn = () => ({
	type: "ZOOM_IN",
});

export const zoomOut = () => ({
	type: "ZOOM_OUT",
});

export const drawSelectionBox =
	({ selectionBox, selectionBoxInBeats }) =>
	(dispatch, getState) => {
		const state = getState();

		const { startBeat, endBeat } = getStartAndEndBeat(state);
		const metadata = { window: { startBeat, endBeat } };

		dispatch({
			type: "DRAW_SELECTION_BOX",
			payload: { selectionBox, selectionBoxInBeats, metadata },
		});
	};

export const clearSelectionBox = () => ({
	type: "CLEAR_SELECTION_BOX",
});

export const commitSelection = () => ({
	type: "COMMIT_SELECTION",
});

export const togglePreviewLightingInEventsView = () => ({
	type: "TOGGLE_PREVIEW_LIGHTING_IN_EVENTS_VIEW",
});

export const tweakEventRowHeight = ({ newHeight }) => ({
	type: "TWEAK_EVENT_ROW_HEIGHT",
	payload: { newHeight },
});

export const tweakEventBackgroundOpacity = ({ newOpacity }) => ({
	type: "TWEAK_EVENT_BACKGROUND_OPACITY",
	payload: { newOpacity },
});

export const dismissPrompt = ({ promptId }) => ({
	type: "DISMISS_PROMPT",
	payload: { promptId },
});

export const toggleEventWindowLock = () => ({
	type: "TOGGLE_EVENT_WINDOW_LOCK",
});

export const toggleLaserLock = () => ({
	type: "TOGGLE_LASER_LOCK",
});

export const toggleModForSong = ({ mod }) => ({
	type: "TOGGLE_MOD_FOR_SONG",
	payload: { mod },
});

export const updateModColor = ({ element, color }) => ({
	type: "UPDATE_MOD_COLOR",
	payload: { element, color },
});
export const updateModColorOverdrive = ({ element, overdrive }) => ({
	type: "UPDATE_MOD_COLOR_OVERDRIVE",
	payload: { element, overdrive },
});

export const updateGrid = ({ numCols, numRows, colWidth, rowHeight }) => ({
	type: "UPDATE_GRID",
	payload: { numCols, numRows, colWidth, rowHeight },
});

export const resetGrid = () => ({
	type: "RESET_GRID",
});

export const loadGridPreset = ({ grid }) => ({
	type: "LOAD_GRID_PRESET",
	payload: { grid },
});

export const saveGridPreset =
	({ presetSlot }) =>
	(dispatch, getState) => {
		const state = getState();

		const grid = getGridSize(state);

		return dispatch({
			type: "SAVE_GRID_PRESET",
			payload: { grid, presetSlot },
		});
	};

export const deleteGridPreset = ({ presetSlot }) => ({
	type: "DELETE_GRID_PRESET",
	payload: { presetSlot },
});

export const toggleFastWallsForSelectedObstacles = () => ({
	type: "TOGGLE_FAST_WALLS_FOR_SELECTED_OBSTACLES",
});
export const togglePropertyForSelectedSong = ({ property }) => ({
	type: "TOGGLE_PROPERTY_FOR_SELECTED_SONG",
	payload: { property },
});

export const updateProcessingDelay = ({ newDelay }) => ({
	type: "UPDATE_PROCESSING_DELAY",
	payload: { newDelay },
});

export const updateGraphicsLevel = ({ newGraphicsLevel }) => ({
	type: "UPDATE_GRAPHICS_LEVEL",
	payload: { newGraphicsLevel },
});

/////////////////
// HELPERS ////
/////////////

const adjustNoteCursorPosition = (cursorPositionInBeats, state) => {
	const isPlaying = getIsPlaying(state);

	if (isPlaying) {
		// If the user tries to place blocks while the song is playing,
		// we want to snap to the nearest snapping interval.
		// eg. if they're set to snap to 1/2 beats, and they click
		// when the song is 3.476 beats in, we should round up to 3.5.
		const snapTo = getSnapTo(state);
		return roundToNearest(cursorPositionInBeats, snapTo);
	}
	// If the song isn't playing, we want to snap to the highest precision we
	// have. Note that this will mean a slight tweak for notes that are a
	// multiple of 3 (eg. a note at 1.333 beats will be rounded to 1.328125)
	return roundToNearest(cursorPositionInBeats, HIGHEST_PRECISION);
};
