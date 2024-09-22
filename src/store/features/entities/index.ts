import { combineReducers } from "@reduxjs/toolkit";

import beatmap from "./beatmap";
import difficulty from "./difficulty";
import lightshow from "./lightshow";

const reducer = combineReducers({
	difficulty: difficulty.reducer,
	notesView: beatmap.reducer,
	eventsView: lightshow.reducer,
});

export default { reducer };
