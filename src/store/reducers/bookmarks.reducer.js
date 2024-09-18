import { produce } from "immer";
import { createSelector } from "reselect";

const initialState = {};

export default function bookmarksReducer(state = initialState, action = undefined) {
	switch (action.type) {
		case "CREATE_NEW_SONG":
		case "START_LOADING_SONG":
		case "LEAVE_EDITOR": {
			return initialState;
		}

		case "LOAD_BEATMAP_ENTITIES": {
			const { bookmarks } = action.payload;
			// The initial data is loaded as an array, we need to convert it to a map.
			return bookmarks.reduce((acc, bookmark) => {
				acc[bookmark.beatNum] = bookmark;
				return acc;
			}, {});
		}

		case "CREATE_BOOKMARK": {
			const { beatNum, name, color } = action.payload;
			return {
				...state,
				[beatNum]: {
					beatNum: beatNum,
					name: name,
					color: color,
				},
			};
		}

		case "DELETE_BOOKMARK": {
			const { beatNum } = action.payload;
			return produce(state, (draftState) => {
				delete draftState[beatNum];
			});
		}

		default:
			return state;
	}
}

export const getBookmarks = (state) => state.bookmarks;
export const getSortedBookmarksArray = createSelector(getBookmarks, (bookmarks) => {
	const bookmarksArray = Object.values(bookmarks);
	return bookmarksArray.sort((a, b) => a.beatNum - b.beatNum);
});
