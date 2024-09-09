import { connect } from "react-redux";

import { ObjectSelectionMode, ObjectTool } from "$/types";
import * as actions from "../../actions";
import { getColorForItem } from "../../helpers/colors.helpers";
import { getVisibleObstacles } from "../../reducers/editor-entities.reducer/notes-view.reducer";
import { getBeatDepth, getSnapTo } from "../../reducers/navigation.reducer";
import { getSelectedSong } from "../../reducers/songs.reducer";

import ObstacleBox from "../ObstacleBox";

const Obstacles = ({ song, obstacles, beatDepth, selectionMode, snapTo, deleteObstacle, resizeObstacle, selectObstacle, deselectObstacle }) => {
	const obstacleColor = getColorForItem(ObjectTool.OBSTACLE, song);

	return obstacles.map((obstacle) => (
		<ObstacleBox
			key={obstacle.id}
			obstacle={obstacle}
			color={obstacleColor}
			beatDepth={beatDepth}
			snapTo={snapTo}
			handleDelete={deleteObstacle}
			handleResize={resizeObstacle}
			handleClick={() => (obstacle.selected ? deselectObstacle(obstacle.id) : selectObstacle(obstacle.id))}
			handleMouseOver={() => {
				if (selectionMode === ObjectSelectionMode.SELECT && !obstacle.selected) {
					selectObstacle(obstacle.id);
				} else if (selectionMode === ObjectSelectionMode.DESELECT && obstacle.selected) {
					deselectObstacle(obstacle.id);
				} else if (selectionMode === ObjectSelectionMode.DELETE) {
					deleteObstacle(obstacle.id);
				}
			}}
		/>
	));
};

const mapStateToProps = (state) => {
	return {
		song: getSelectedSong(state),
		obstacles: getVisibleObstacles(state),
		beatDepth: getBeatDepth(state),
		selectionMode: state.editor.notes.selectionMode,
		snapTo: getSnapTo(state),
	};
};

const mapDispatchToProps = {
	deleteObstacle: actions.deleteObstacle,
	resizeObstacle: actions.resizeObstacle,
	selectObstacle: actions.selectObstacle,
	deselectObstacle: actions.deselectObstacle,
};

export default connect(mapStateToProps, mapDispatchToProps)(Obstacles);
