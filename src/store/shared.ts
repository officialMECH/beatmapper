import { createEngine } from "./enhancers/storage";

export function createPersistenceEngine() {
	return createEngine(["user", "editor", ["songs", "byId"], ["navigation", "snapTo"], ["navigation", "beatDepth"], ["navigation", "volume"], ["navigation", "playNoteTick"]]);
}
