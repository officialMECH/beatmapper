import { combineReducers } from "redux";

import bookmarks from "./bookmarks.reducer";
import clipboard from "./clipboard.reducer";
import editorEntities from "./editor-entities.reducer";
import editor from "./editor.reducer";
import global from "./global.reducer";
import navigation from "./navigation.reducer";
import songs from "./songs.reducer";
import user from "./user.reducer";
import waveform from "./waveform.reducer";

export default combineReducers({
	songs,
	clipboard,
	editorEntities,
	waveform,
	navigation,
	editor,
	global,
	user,
	bookmarks,
});
