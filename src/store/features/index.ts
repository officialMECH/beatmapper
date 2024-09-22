import { combineReducers } from "@reduxjs/toolkit";

import bookmarks from "./bookmarks";
import clipboard from "./clipboard";
import editor from "./editor";
import entities from "./entities";
import global from "./global";
import navigation from "./navigation";
import songs from "./songs";
import user from "./user";
import waveform from "./waveform";

const reducer = combineReducers({
	songs: songs.reducer,
	clipboard: clipboard.reducer,
	editorEntities: entities.reducer,
	waveform: waveform.reducer,
	navigation: navigation.reducer,
	editor: editor.reducer,
	global: global.reducer,
	user: user.reducer,
	bookmarks: bookmarks.reducer,
});

export default {
	reducer,
};
