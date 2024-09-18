import { useSelector } from "react-redux";

import { createObstacleFromMouseEvent } from "$/helpers/obstacles.helpers";
import { getDefaultObstacleDuration } from "$/store/reducers/editor.reducer";
import { getBeatDepth } from "$/store/reducers/navigation.reducer";
import { getGridSize } from "$/store/reducers/songs.reducer";

import ObstacleBox from "../ObstacleBox";

const TentativeObstacle = ({ mouseDownAt, color, mode, ...rest }) => {
	const { numRows: gridRows, numCols: gridCols, colWidth: gridColWidth, rowHeight: gridRowHeight } = useSelector(getGridSize);
	const beatDepth = useSelector(getBeatDepth);
	const defaultObstacleDuration = useSelector(getDefaultObstacleDuration);

	// If no mouseOverAt is provided, it ought to be the same as the mouseDownAt.
	// They've clicked but haven't moved yet, ergo only one row/col is at play.
	let { mouseOverAt } = rest;
	if (!mouseOverAt) {
		mouseOverAt = mouseDownAt;
	}

	const tentativeObstacle = createObstacleFromMouseEvent(mode, gridCols, gridRows, gridColWidth, gridRowHeight, mouseDownAt, mouseOverAt, defaultObstacleDuration);

	tentativeObstacle.id = "tentative";
	tentativeObstacle.tentative = true;
	tentativeObstacle.beatStart = 0;

	return (
		<ObstacleBox
			obstacle={tentativeObstacle}
			beatDepth={beatDepth}
			color={color}
			snapTo={1} // Doesn't matter
			gridRows={gridRows}
			gridCols={gridCols}
			handleDelete={() => {}}
			handleResize={() => {}}
			handleClick={() => {}}
		/>
	);
};

export default TentativeObstacle;
