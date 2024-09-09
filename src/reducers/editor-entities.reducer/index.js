/**
 * This reducer manages all "live-editable" entities - notes, events, obstacles.
 *
 * It also dictates the metadata about what's being edited, like which
 * difficulty. This is important because when the user goes to download this
 * map (or, perhaps periodically in the future), I'll want to save this data to
 * indexeddb as a text file, and I need to know which difficulty we're editing.
 */

import { combineReducers } from "redux";

import { View } from "$/types";
import eventsView, { getSelectedEvents } from "./events-view.reducer";
import notesView, { getSelectedNotesAndObstacles } from "./notes-view.reducer";

const initialState = {
	difficulty: null,
	// Controlled by child reducers:
	notesView: {},
	eventsView: {},
};

const difficulty = (state = initialState, action = undefined) => {
	switch (action.type) {
		case "CREATE_NEW_SONG": {
			return action.selectedDifficulty;
		}

		case "START_LOADING_SONG": {
			return action.difficulty;
		}

		default:
			return state;
	}
};

export default combineReducers({ difficulty, notesView, eventsView });

//
//
// Selectors
//
export const getDifficulty = (state) => state.editorEntities.difficulty;

export const getSelection = (state, view) => {
	if (view === View.LIGHTSHOW) {
		return getSelectedEvents(state);
	}
	if (view === View.BEATMAP) {
		return getSelectedNotesAndObstacles(state);
	}
};
