/* eslint-disable */

import { default as dev } from "./store.dev.js";
import { default as prod } from "./store.prod.js";

let instance;

if (process.env.NODE_ENV === "production") {
	instance = prod;
} else {
	instance = dev;
}

export default instance;
