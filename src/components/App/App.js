import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { getHasInitialized } from "../../reducers/global.reducer";

import DevTools from "../DevTools";
import Docs from "../Docs";
import Editor from "../Editor";
import GlobalStyles from "../GlobalStyles";
import Home from "../Home";
import LoadingScreen from "../LoadingScreen";

import "react-tippy/dist/tippy.css";

const App = ({ hasInitialized }) => {
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
			<DevTools />
			<GlobalStyles />
		</>
	);
};

const mapStateToProps = (state) => ({
	hasInitialized: getHasInitialized(state),
});

export default connect(mapStateToProps)(App);
