import { type DevToolsEnhancerOptions, configureStore } from "@reduxjs/toolkit";
import { createLoader } from "redux-storage";

import { tick } from "./actions";
import { storage } from "./enhancers";
import root from "./features";
import { createAllSharedMiddlewares } from "./middleware";
import { createPersistenceEngine } from "./shared";

function createStore() {
	const engine = createPersistenceEngine();
	const middleware = createAllSharedMiddlewares(engine);

	const devTools: DevToolsEnhancerOptions = {
		actionsDenylist: [tick.type],
	};

	const store = configureStore({
		reducer: root.reducer,
		devTools: import.meta.env.VITE_ENABLE_DEVTOOLS ? devTools : undefined,
		middleware: (native) => native({ serializableCheck: false, immutableCheck: false }).concat(...middleware),
		enhancers: (native) => native().concat(storage(engine)),
	});

	const load = createLoader(engine);
	load(store).then(
		() => {},
		(err) => console.error("Failed to load previous state", err),
	);

	return store;
}

export type RootState = ReturnType<typeof root.reducer>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];

export default createStore;
