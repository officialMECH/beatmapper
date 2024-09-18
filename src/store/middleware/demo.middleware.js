/**
 * This middleware exists only to load (and possibly manage) the demo song
 * that comes with this app.
 */

import { demoFileUrl } from "$/assets";
import { processImportedMap } from "$/services/packaging.service";
import { importExistingSong } from "../actions";
import { getIsNewUser } from "../reducers/user.reducer";

export default function createDemoMiddleware() {
	return (store) => (next) => (action) => {
		next(action);

		if (action.type === "LOAD_DEMO_MAP") {
			// If this is a brand-new user, they won't have the demo song at all
			const state = store.getState();
			const isNewUser = getIsNewUser(state);

			if (isNewUser) {
				fetch(demoFileUrl)
					.then((res) => res.blob())
					.then((blob) => processImportedMap(blob, []))
					.then((songData) => {
						songData.demo = true;
						next(importExistingSong({ songData }));
					})
					.then(() => {
						// HACK: Should pull data from demoSong
						window.location = "/edit/only-now/Normal/notes";
					});
			}
		}
	};
}
