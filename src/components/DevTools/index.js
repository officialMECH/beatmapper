import { DEVTOOLS_ENABLED_IN_DEV } from "../../constants";

import { default as dev } from "./index.dev.js";
import { default as prod } from "./index.prod.js";

let instance;

if (process.env.NODE_ENV === "production" || !DEVTOOLS_ENABLED_IN_DEV) {
	instance = prod;
} else {
	instance = dev;
}

export default instance;
