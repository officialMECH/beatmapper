import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { getHasInitialized } from "$/store/selectors";

import Docs from "../Docs";
import Editor from "../Editor";
import GlobalStyles from "../GlobalStyles";
import Home from "../Home";
import LoadingScreen from "../LoadingScreen";

import "react-tippy/dist/tippy.css";

const App = () => {
	const hasInitialized = useSelector(getHasInitialized);

	if (!hasInitialized) {
		return <LoadingScreen />;
	}

	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/edit/:songId/:difficulty/*" element={<Editor />} />
				<Route path="/docs/*" element={<Docs />} />
			</Routes>
			<GlobalStyles />
		</>
	);
};

export default App;
