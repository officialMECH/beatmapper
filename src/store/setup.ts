import { type DevToolsEnhancerOptions, configureStore } from "@reduxjs/toolkit";
import { createLoader, reducer as storageReducer } from "redux-storage";

import { tick } from "./actions";
import root from "./features";
import { createAllSharedMiddlewares, createPersistenceEngine } from "./shared";

function createStore() {
	const persistenceEngine = createPersistenceEngine();
	const middleware = createAllSharedMiddlewares(persistenceEngine);

	const reducer = storageReducer(root.reducer);

	const devTools: DevToolsEnhancerOptions = {
		actionsDenylist: [tick.type],
	};

	const store = configureStore({
		reducer: reducer,
		devTools: import.meta.env.VITE_ENABLE_DEVTOOLS ? devTools : undefined,
		middleware: (native) => native({ serializableCheck: false, immutableCheck: false }).concat(...middleware),
	});

	const load = createLoader(persistenceEngine);
	load(store).then(
		() => {},
		(err) => console.error("Failed to load previous state", err),
	);

	return store;
}

export type RootState = ReturnType<typeof root.reducer>;

export default createStore;
