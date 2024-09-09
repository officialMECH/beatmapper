import { default as dev } from "./index.dev.js";
import { default as prod } from "./index.prod.js";

let instance;

if (import.meta.env.PROD || !import.meta.env.VITE_ENABLE_DEVTOOLS) {
	instance = prod;
} else {
	instance = dev;
}

export default instance;
