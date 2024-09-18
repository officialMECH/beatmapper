/// <reference types="vite/client" />

declare module "@react-three/fiber" {
	import type { TextGeometry } from "three-stdlib";
	export interface ThreeElements {
		/** @requires `extend` from `@react-three/fiber` */
		textGeometry: BufferGeometryNode<TextGeometry, typeof TextGeometry>;
	}
}

declare module "redux-state-sync" {
	import type { BroadcastChannelOptions } from "broadcast-channel";
	import type { Middleware, UnknownAction } from "redux";
	export interface Config<S> {
		channel?: string | undefined;
		predicate?: ((action: UnknownAction) => boolean | null) | undefined;
		blacklist?: string[] | undefined;
		whitelist?: string[] | undefined;
		broadcastChannelOption?: BroadcastChannelOptions | undefined;
		prepareState?: ((state: S) => S) | undefined;
		receiveState?: ((prevState: S, nextState: S) => S) | undefined;
	}
	// biome-ignore lint/complexity/noBannedTypes: valid use case
	export function createStateSyncMiddleware<S>(config?: Config<S>): Middleware<{}, S>;
}

declare module "redux-storage" {
	import type { Middleware, Reducer, Store } from "redux";

	export const LOAD: "REDUX_STORAGE_LOAD";
	export const SAVE: "REDUX_STORAGE_SAVE";

	export interface StorageEngine<S = unknown> {
		load(): PromiseLike<S>;
		save(state: S): PromiseLike<S>;
	}
	export type StateMerger<O, N> = (oldState: O, newState: N) => O & N;
	export type ActionTypeCheckCallback = (type: string) => boolean;
	type Loader<TState> = (store: Store<TState>) => PromiseLike<unknown>;

	export function reducer<TState>(reducer: Reducer<TState>, merger?: StateMerger): Reducer<TState>;
	// biome-ignore lint/complexity/noBannedTypes: valid use case
	export function createMiddleware<S>(engine: StorageEngine<S>, actionBlacklist?: string[], actionWhitelist?: string[] | ActionTypeCheckCallback): Middleware<{}, S>;
	export function createLoader<TState>(engine: StorageEngine): Loader<TState>;
}

declare module "redux-storage-engine-localforage" {
	import type { StorageEngine } from "redux-storage";

	type Replacer = <T extends string | boolean | number | object>(this: ThisParameterType, key: string, value: T) => T;
	type Reviver = <T extends string | boolean | number | object>(this: ThisParameterType, key: string, value: T) => T;

	export default function (key: string, config?: LocalForageOptions, replacer?: Replacer, reviver?: Reviver): StorageEngine;
}

declare module "redux-storage-decorator-debounce" {
	import type { StorageEngine } from "redux-storage";

	export default function (engine: StorageEngine, ms: number): StorageEngine;
}
