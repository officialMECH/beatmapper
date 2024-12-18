import { BLOCK_PLACEMENT_SQUARE_SIZE, SONG_OFFSET } from "$/constants";
import { App } from "$/types";

export function getPositionForObstacle(obstacle: App.Obstacle, obstacleDimensions: { width: number; height: number; depth: number }, zOffset: number): [number, number, number] {
	const position = { x: 0, y: 0, z: 0 };

	// ----------- X ------------
	// Our initial X should be 1.5 blocks to the left (an 'X' of 0 would be the dividing line between the 2nd and 3rd column,
	// so I need it to move 1.5 units to the left, to sit in the center of the 1st column)
	const OFFSET_X = BLOCK_PLACEMENT_SQUARE_SIZE * 1.5 * -1;
	position.x = obstacle.lane * BLOCK_PLACEMENT_SQUARE_SIZE + OFFSET_X;
	position.x += obstacle.colspan * (BLOCK_PLACEMENT_SQUARE_SIZE / 2) - BLOCK_PLACEMENT_SQUARE_SIZE / 2;

	// ----------- Y ------------
	if (obstacle.type === App.ObstacleType.EXTENDED) {
		const mapObstacle = obstacle as App.MappingExtensionObstacle;
		const OFFSET_Y = BLOCK_PLACEMENT_SQUARE_SIZE * -1;
		position.y = mapObstacle.rowIndex * BLOCK_PLACEMENT_SQUARE_SIZE + OFFSET_Y;
		position.y += obstacleDimensions.height / 2 - BLOCK_PLACEMENT_SQUARE_SIZE / 2;
	} else if (obstacle.type === App.ObstacleType.FULL || obstacle.type === App.ObstacleType.TOP) {
		const top = BLOCK_PLACEMENT_SQUARE_SIZE * 1.75;
		position.y = top - obstacleDimensions.height / 2;
	}

	// ----------- Z ------------
	const zFront = obstacle.beatStart * zOffset * -1 - SONG_OFFSET;
	position.z = zFront - obstacleDimensions.depth / 2 + 0.05;

	return [position.x, position.y, position.z];
}

export function getDimensionsForObstacle(obstacle: App.Obstacle, beatDepth: number) {
	let width: number;
	let height: number;
	let depth: number;

	width = obstacle.colspan * BLOCK_PLACEMENT_SQUARE_SIZE;
	depth = obstacle.beatDuration * beatDepth;

	if (obstacle.type === App.ObstacleType.EXTENDED) {
		const extensionObstacle = obstacle as App.MappingExtensionObstacle;
		height = extensionObstacle.rowspan * BLOCK_PLACEMENT_SQUARE_SIZE;
	} else {
		// Height is tricky since it depends on the type.
		height = obstacle.type === App.ObstacleType.FULL ? BLOCK_PLACEMENT_SQUARE_SIZE * 3.5 : BLOCK_PLACEMENT_SQUARE_SIZE * 1.25;
	}

	// We don't want to allow invisible / 0-depth walls
	if (depth === 0) {
		depth = 0.01;
	}

	return { width, height, depth };
}
