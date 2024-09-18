import { useDispatch, useSelector } from "react-redux";

import { UNIT } from "$/constants";
import { promptChangeObstacleDuration } from "$/helpers/prompts.helpers";
import { resizeSelectedObstacles, toggleFastWallsForSelectedObstacles } from "$/store/actions";
import { getSelectedObstacles } from "$/store/reducers/editor-entities.reducer/notes-view.reducer";
import { getEnabledFastWalls } from "$/store/reducers/songs.reducer";

import Heading from "../Heading";
import MiniButton from "../MiniButton";
import Spacer from "../Spacer";

const ObstacleTweaks = () => {
	const selectedObstacles = useSelector(getSelectedObstacles);
	const enabledFastWalls = useSelector(getEnabledFastWalls);
	const dispatch = useDispatch();

	return (
		<>
			<Heading size={3}>Selected Walls</Heading>
			<Spacer size={UNIT * 1.5} />
			<MiniButton onClick={() => dispatch(promptChangeObstacleDuration(selectedObstacles, resizeSelectedObstacles))}>Change duration</MiniButton>
			{enabledFastWalls && (
				<>
					<Spacer size={UNIT} />
					<MiniButton onClick={() => dispatch(toggleFastWallsForSelectedObstacles())}>Toggle Fast Walls</MiniButton>
				</>
			)}
		</>
	);
};

export default ObstacleTweaks;
