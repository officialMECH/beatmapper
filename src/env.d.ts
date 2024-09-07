/// <reference types="vite/client" />

import type { TextGeometry } from "three-stdlib";

declare module "@react-three/fiber" {
	export interface ThreeElements {
		/** @requires `extend` from `@react-three/fiber` */
		textGeometry: BufferGeometryNode<TextGeometry, typeof TextGeometry>;
	}
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
