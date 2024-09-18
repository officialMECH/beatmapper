/**
 * Store redux state in local-storage, so that the app can be rehydrated
 * when the page is refreshed.
 */

import localforage from "localforage";
import debounce from "redux-storage-decorator-debounce";
import filter from "redux-storage-decorator-filter";

const key = import.meta.env.DEV ? "redux-state-dev" : "redux-state";

const config = {
	driver: localforage.INDEXEDDB,
	name: "beat-mapper-state",
};

const createEngine = (whitelist = []) => {
	// This `createEngine` function modified
	// https://raw.githubusercontent.com/mathieudutour/redux-storage-engine-localforage/master/src/index.js
	const reduxStore = localforage.createInstance({
		name: "BeatMapper redux state",
	});

	function rejectWithMessage(error) {
		return Promise.reject(error.message);
	}

	reduxStore.config(config);

	let engine = {
		async load() {
			try {
				const jsonState = await reduxStore.getItem(key);
				return JSON.parse(jsonState) || {};
			} catch (error) {
				return rejectWithMessage(error);
			}
		},

		async save(state) {
			try {
				const jsonState = JSON.stringify(state);
				return await reduxStore.setItem(key, jsonState);
			} catch (error) {
				return rejectWithMessage(error);
			}
		},
	};

	// TODO: Add migrations here, if/when necessary
	// engine = handleMigrations(engine)

	engine = debounce(engine, 250);

	engine = filter(engine, whitelist);

	return engine;
};

export default createEngine;
