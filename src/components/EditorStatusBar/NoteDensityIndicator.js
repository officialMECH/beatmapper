import { layers as densityIcon } from "react-icons-kit/feather/layers";
import { connect } from "react-redux";

import { getNoteDensity } from "$/store/reducers/editor-entities.reducer/notes-view.reducer";
import { roundTo } from "$/utils";

import CountIndicator from "./CountIndicator";

const NoteDensityIndicator = ({ noteDensity }) => {
	return <CountIndicator num={roundTo(noteDensity, 1)} label="Notes per second" icon={densityIcon} />;
};

const mapStateToProps = (state) => {
	return {
		noteDensity: getNoteDensity(state),
	};
};

export default connect(mapStateToProps)(NoteDensityIndicator);
