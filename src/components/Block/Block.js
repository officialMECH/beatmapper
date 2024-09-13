import React from "react";

import { useObject } from "$/hooks";
import { Direction, ObjectSelectionMode } from "$/types";
import { convertDegreesToRadians } from "$/utils";
import blockCenterUrl from "../../assets/obj/block-center.obj?url";
import blockDirectionalUrl from "../../assets/obj/block-directional.obj?url";

const getBlockUrlForDirection = (direction) => {
	// If the direction is >=1000, that means it's a MappingExtensions thing.
	// Must be directional.
	if (direction >= 1000) {
		return blockDirectionalUrl;
	}

	switch (direction) {
		case Direction.UP:
		case Direction.DOWN:
		case Direction.LEFT:
		case Direction.RIGHT:
		case Direction.UP_LEFT:
		case Direction.UP_RIGHT:
		case Direction.DOWN_LEFT:
		case Direction.DOWN_RIGHT:
			return blockDirectionalUrl;
		case Direction.ANY:
			return blockCenterUrl;
		default:
			throw new Error(`Unrecognized direction: ${direction}`);
	}
};

const getRotationForDirection = (direction) => {
	// If the rotation is >=1000, we're in MappingExtensions land :D
	// It uses a 1000-1360 system, from down clockwise.
	// We have some conversions to do, to get an angle in radians.
	if (direction >= 1000) {
		// (this formula is a little bonkers, there's probably a simpler way.)
		// (but it works.)
		const reorientedAngle = 180 - ((direction + 270) % 360);
		const angleInRads = convertDegreesToRadians(reorientedAngle);

		return angleInRads;
	}

	// The numbering system used is completely nonsensical:
	//
	//   4  0  5
	//   2  8  3
	//   6  1  7
	//
	// Our block by default points downwards, so we'll do x-axis rotations
	// depending on the number
	switch (direction) {
		case Direction.UP:
			return Math.PI;
		case Direction.DOWN:
			return 0;
		case Direction.LEFT:
			return Math.PI * -0.5;
		case Direction.RIGHT:
			return Math.PI * 0.5;
		case Direction.UP_LEFT:
			return Math.PI * -0.75;
		case Direction.UP_RIGHT:
			return Math.PI * 0.75;
		case Direction.DOWN_LEFT:
			return Math.PI * -0.25;
		case Direction.DOWN_RIGHT:
			return Math.PI * 0.25;

		case Direction.ANY:
			return 0;

		default:
			throw new Error(`Unrecognized direction: ${direction}`);
	}
};

const Block = React.memo(({ x, y, z, time, lineLayer, lineIndex, direction, size = 1, color = 0xff0000, isTransparent, isSelected, selectionMode, handleClick, handleStartSelecting, handleMouseOver }) => {
	const position = [x, y, z];

	const scaleFactor = size * 0.5;

	const url = getBlockUrlForDirection(direction);
	const group = useObject(url);

	if (!group) {
		return null;
	}

	const geometry = group.children[0].geometry;

	const rotation = [0, 0, getRotationForDirection(direction)];

	const onClick = (ev) => {
		ev.stopPropagation();
	};

	const onPointerDown = (ev) => {
		ev.stopPropagation();

		// We can rapidly select/deselect/delete notes by clicking, holding,
		// and dragging the cursor across the field.
		let newSelectionMode;
		if (ev.button === 0) {
			newSelectionMode = isSelected ? ObjectSelectionMode.DESELECT : ObjectSelectionMode.SELECT;
		} else if (ev.button === 1) {
			// Middle clicks shouldnt affect selections
			newSelectionMode = null;
		} else if (ev.button === 2) {
			newSelectionMode = ObjectSelectionMode.DELETE;
		}

		if (newSelectionMode) {
			handleStartSelecting(newSelectionMode);
		}

		// prettier-ignore
		const clickType = ev.button === 0 ? "left" : ev.button === 1 ? "middle" : ev.button === 2 ? "right" : undefined;

		if (clickType) {
			handleClick(clickType, time, lineLayer, lineIndex);
		}
	};

	const onPointerOver = (ev) => {
		// While selecting/deselecting/deleting notes, pointer-over events are
		// important and should trump others.
		if (selectionMode) {
			ev.stopPropagation();
			handleMouseOver(time, lineLayer, lineIndex);
		}
	};

	return (
		<group>
			<mesh castShadow position={position} scale={[scaleFactor, scaleFactor, scaleFactor]} rotation={rotation} onClick={onClick} onPointerDown={onPointerDown} onPointerOver={onPointerOver}>
				<primitive object={geometry} attach="geometry" />
				<meshStandardMaterial attach="material" metalness={0.5} roughness={0.4} color={color} transparent={isTransparent} emissive={"yellow"} emissiveIntensity={isSelected ? 0.5 : 0} opacity={isTransparent ? 0.25 : 1} />
			</mesh>

			{/* Fake flowing light from within */}
			<mesh position={[position[0], position[1], position[2] + size * 0.2]} rotation={rotation} onClick={onClick} onPointerDown={onPointerDown} onPointerOver={onPointerOver}>
				<planeGeometry attach="geometry" args={[size * 0.8, size * 0.8]} />
				<meshLambertMaterial attach="material" emissive={0xffffff} transparent={isTransparent} opacity={isTransparent ? 0.25 : 1} />
			</mesh>
		</group>
	);
});

export default Block;
