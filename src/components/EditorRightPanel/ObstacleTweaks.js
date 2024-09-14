import { connect } from "react-redux";

import { UNIT } from "$/constants";
import { promptChangeObstacleDuration } from "$/helpers/prompts.helpers";
import * as actions from "$/store/actions";
import { getSelectedObstacles } from "$/store/reducers/editor-entities.reducer/notes-view.reducer";
import { getEnabledFastWalls } from "$/store/reducers/songs.reducer";

import Heading from "../Heading";
import MiniButton from "../MiniButton";
import Spacer from "../Spacer";

const ObstacleTweaks = ({ selectedObstacles, enabledFastWalls, resizeSelectedObstacles, toggleFastWallsForSelectedObstacles }) => {
	return (
		<>
			<Heading size={3}>Selected Walls</Heading>
			<Spacer size={UNIT * 1.5} />
			<MiniButton onClick={() => promptChangeObstacleDuration(selectedObstacles, resizeSelectedObstacles)}>Change duration</MiniButton>
			{enabledFastWalls && (
				<>
					<Spacer size={UNIT} />
					<MiniButton onClick={toggleFastWallsForSelectedObstacles}>Toggle Fast Walls</MiniButton>
				</>
			)}
		</>
	);
};

const mapStateToProps = (state) => {
	return {
		selectedObstacles: getSelectedObstacles(state),
		enabledFastWalls: getEnabledFastWalls(state),
	};
};

const mapDispatchToProps = {
	resizeSelectedObstacles: actions.resizeSelectedObstacles,
	toggleFastWallsForSelectedObstacles: actions.toggleFastWallsForSelectedObstacles,
};

export default connect(mapStateToProps, mapDispatchToProps)(ObstacleTweaks);
