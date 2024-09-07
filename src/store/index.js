/* eslint-disable */

import { default as dev } from "./store.dev.js";
import { default as prod } from "./store.prod.js";

let instance;

if (import.meta.env.PROD) {
	instance = prod;
} else {
	instance = dev;
}

export default instance;
