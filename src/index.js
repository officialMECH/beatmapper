import isPropValid from "@emotion/is-prop-valid";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromChildren } from "react-router-dom";
import { StyleSheetManager } from "styled-components";

import configureStore from "./store";

import App from "./components/App";

const store = configureStore();

const root = createRoot(document.getElementById("root"));

const router = createBrowserRouter(createRoutesFromChildren(<Route path="*" element={<App />} />));

root.render(
	<Provider store={store}>
		<StyleSheetManager shouldForwardProp={shouldForwardProp}>
			<RouterProvider router={router} />
		</StyleSheetManager>
	</Provider>,
);

function shouldForwardProp(propName, target) {
	if (typeof target === "string") return isPropValid(propName);
	return true;
}
