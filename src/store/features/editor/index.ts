import { combineReducers } from "@reduxjs/toolkit";

import beatmap from "./beatmap";
import lightshow from "./lightshow";

const reducer = combineReducers({
	notes: beatmap.reducer,
	events: lightshow.reducer,
});

export default {
	reducer: reducer,
};
