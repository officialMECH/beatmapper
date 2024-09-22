/**
 * NOTE: I don't really think this middleware is necessary.
 * I think all this stuff can be done at the component level, maybe put into
 * helper functions if it feels crowded.
 *
 * Will do a different approach for events. This is just for notes-view stuff.
 */

import { findNoteByProperties } from "$/helpers/notes.helpers";
import { bulkDeleteNote, deleteNote, deselectNote, selectNote, toggleNoteColor } from "$/store/actions";
import { getNotes } from "$/store/selectors";
import { ObjectSelectionMode } from "$/types";

export default function createSelectionMiddleware() {
	return (store) => (next) => (action) => {
		switch (action.type) {
			case "CLICK_NOTE": {
				const state = store.getState();
				const { clickType, time, lineLayer, lineIndex } = action.payload;
				const note = findNoteByProperties(getNotes(state), { time, lineLayer, lineIndex });

				if (clickType === "middle") {
					next(toggleNoteColor({ time, lineLayer, lineIndex }));
				} else if (clickType === "right") {
					next(deleteNote({ time, lineLayer, lineIndex }));
				} else if (note.selected) {
					next(deselectNote({ time, lineLayer, lineIndex }));
				} else {
					next(selectNote({ time, lineLayer, lineIndex }));
				}

				break;
			}

			case "MOUSE_OVER_NOTE": {
				const state = store.getState();
				const { time, lineLayer, lineIndex } = action.payload;
				const { selectionMode } = state.editor.notes;

				// Ignore any mouseovers when not in a selection mode
				if (!selectionMode) {
					return;
				}

				// Find the note we're mousing over
				const note = findNoteByProperties(getNotes(state), { time, lineLayer, lineIndex });

				// If the selection mode is delete, we can simply remove this note.
				if (selectionMode === ObjectSelectionMode.DELETE) {
					return next(bulkDeleteNote({ time, lineLayer, lineIndex }));
				}

				// Ignore double-positives or double-negatives
				const alreadySelected = note.selected && selectionMode === ObjectSelectionMode.SELECT;
				const alreadyDeselected = !note.selected && selectionMode === ObjectSelectionMode.DESELECT;
				if (alreadySelected || alreadyDeselected) {
					return;
				}

				if (note.selected) {
					return next(deselectNote({ time, lineLayer, lineIndex }));
				}
				return next(selectNote({ time, lineLayer, lineIndex }));
			}

			default:
				return next(action);
		}
	};
}
