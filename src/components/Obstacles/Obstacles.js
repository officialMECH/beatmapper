import { useDispatch, useSelector } from "react-redux";

import { getColorForItem } from "$/helpers/colors.helpers";
import { deleteObstacle, deselectObstacle, resizeObstacle, selectObstacle } from "$/store/actions";
import { getVisibleObstacles } from "$/store/reducers/editor-entities.reducer/notes-view.reducer";
import { getBeatDepth, getSnapTo } from "$/store/reducers/navigation.reducer";
import { getSelectedSong } from "$/store/reducers/songs.reducer";
import { ObjectSelectionMode, ObjectTool } from "$/types";

import ObstacleBox from "../ObstacleBox";

const Obstacles = () => {
	const song = useSelector(getSelectedSong);
	const obstacles = useSelector(getVisibleObstacles);
	const beatDepth = useSelector(getBeatDepth);
	const selectionMode = useSelector((state) => state.editor.notes.selectionMode);
	const snapTo = useSelector(getSnapTo);
	const dispatch = useDispatch();

	const obstacleColor = getColorForItem(ObjectTool.OBSTACLE, song);

	return obstacles.map((obstacle) => (
		<ObstacleBox
			key={obstacle.id}
			obstacle={obstacle}
			color={obstacleColor}
			beatDepth={beatDepth}
			snapTo={snapTo}
			handleDelete={(id) => dispatch(deleteObstacle({ id }))}
			handleResize={(id, newBeatDuration) => dispatch(resizeObstacle({ id, newBeatDuration }))}
			handleClick={() => dispatch(obstacle.selected ? deselectObstacle({ id: obstacle.id }) : selectObstacle({ id: obstacle.id }))}
			handleMouseOver={() => {
				if (selectionMode === ObjectSelectionMode.SELECT && !obstacle.selected) {
					dispatch(selectObstacle({ id: obstacle.id }));
				} else if (selectionMode === ObjectSelectionMode.DESELECT && obstacle.selected) {
					dispatch(deselectObstacle({ id: obstacle.id }));
				} else if (selectionMode === ObjectSelectionMode.DELETE) {
					dispatch(deleteObstacle({ id: obstacle.id }));
				}
			}}
		/>
	));
};

export default Obstacles;
