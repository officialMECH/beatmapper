import { applyMiddleware, compose, createStore } from "redux";
import * as storage from "redux-storage";

import DevTools from "../components/DevTools";
import rootReducer from "../reducers";

import { createAllSharedMiddlewares, createPersistenceEngine } from "./shared";

export default function configureStore(initialState) {
	const persistenceEngine = createPersistenceEngine();
	const middlewares = createAllSharedMiddlewares(persistenceEngine);

	const wrappedReducer = storage.reducer(rootReducer);

	let enhancers;
	if (import.meta.env.VITE_ENABLE_DEVTOOLS) {
		enhancers = compose(applyMiddleware(...middlewares), DevTools.instrument());
	} else {
		enhancers = compose(applyMiddleware(...middlewares));
	}

	const store = createStore(wrappedReducer, initialState, enhancers);

	const load = storage.createLoader(persistenceEngine);
	load(store).catch((err) => console.error("Failed to load previous state", err));

	window.store = store;

	return store;
}
