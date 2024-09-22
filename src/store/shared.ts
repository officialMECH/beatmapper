import { createStateSyncMiddleware } from "redux-state-sync";
import { type StorageEngine, createMiddleware as createStorageMiddleware } from "redux-storage";

import createBackupMiddleware from "./middleware/backup.middleware";
import createDemoMiddleware from "./middleware/demo.middleware";
import createHistoryMiddleware from "./middleware/history.middleware";
import createPackagingMiddleware from "./middleware/packaging.middleware";
import createSelectionMiddleware from "./middleware/selection.middleware";
import createSongMiddleware from "./middleware/song.middleware";

import createEngine from "./enhancers/persistence-engine";

export const createPersistenceEngine = () => createEngine(["user", "editor", ["songs", "byId"], ["navigation", "snapTo"], ["navigation", "beatDepth"], ["navigation", "volume"], ["navigation", "playNoteTick"]]);

export function createAllSharedMiddlewares(persistenceEngine: StorageEngine) {
	const stateSyncMiddleware = createStateSyncMiddleware({
		// We don't need to save in other tabs
		blacklist: ["REDUX_STORAGE_SAVE", "START_PLAYING", "PAUSE_PLAYING", "STOP_PLAYING", "TOGGLE_PLAYING", "DOWNLOAD_MAP_FILES"],
	});

	const songMiddleware = createSongMiddleware();
	const selectionMiddleware = createSelectionMiddleware();
	const downloadMiddleware = createPackagingMiddleware();
	const backupMiddleware = createBackupMiddleware();
	const demoMiddleware = createDemoMiddleware();
	const historyMiddleware = createHistoryMiddleware();
	const storageMiddleware = createStorageMiddleware(persistenceEngine);

	return [
		// For unknown reasons, things crash when `stateSyncMiddleware` is further down.
		stateSyncMiddleware,
		songMiddleware,
		selectionMiddleware,
		downloadMiddleware,
		demoMiddleware,
		historyMiddleware,
		// We have two middlewares related to persistence:
		// - Storage middleware persists the current redux state to localforage
		// - Backup middleware saves the editor entities as beatmap files, also in localforage.
		// It's important that this stuff happens last, after all the other middlewares have fully affected the state.
		storageMiddleware,
		backupMiddleware,
	];
}
