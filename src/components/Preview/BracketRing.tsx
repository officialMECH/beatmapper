import { animated, useSpring } from "@react-spring/three";
import type { ColorRepresentation, Vector3Tuple } from "three";

interface ModelProps {
	side?: "top" | "bottom";
	size: number;
	thickness: number;
	color: ColorRepresentation;
}

const RingHalf = ({ side, size, thickness, color }: ModelProps) => {
	const length = size;
	const height = length * 0.25;

	// If this is the bottom half, we need to rotate the whole thing 180deg.
	const rotation: Vector3Tuple = side === "bottom" ? [0, 0, Math.PI] : [0, 0, 0];

	return (
		<group rotation={rotation}>
			{/* Long beam */}
			<mesh position={[0, length / 2, 0]}>
				<boxGeometry attach="geometry" args={[length, thickness, thickness]} />
				<meshLambertMaterial attach="material" color={color} />
			</mesh>

			{/* Stubby legs */}
			<mesh position={[-length / 2 + thickness / 2, length / 2 - height / 2, 0]} rotation={[0, 0, Math.PI * 0.5]}>
				<boxGeometry attach="geometry" args={[height, thickness, thickness]} />
				<meshLambertMaterial attach="material" color={color} />
			</mesh>
			<mesh position={[length / 2 - thickness / 2, length / 2 - height / 2, 0]} rotation={[0, 0, Math.PI * 0.5]}>
				<boxGeometry attach="geometry" args={[height, thickness, thickness]} />
				<meshLambertMaterial attach="material" color={color} />
			</mesh>
		</group>
	);
};

interface Props {
	size?: number;
	thickness: number;
	x?: number;
	y?: number;
	z?: number;
	rotation?: number;
	color: ColorRepresentation;
}

const BracketRing = ({ size = 12, thickness, x = 0, y = -2, z = -8, rotation = Math.PI * 0.25, color }: Props) => {
	// Each ring consists of 2 identical-but-mirrored pieces, each the shape of an unused staple:
	// [ ]

	const spring = useSpring({
		to: {
			position: [x, y, z],
			rotation: [0, 0, rotation],
		},
		config: {
			tension: 250,
			friction: 90,
			mass: 0.5,
		},
	});

	return (
		<animated.group position={spring.position} rotation={spring.rotation}>
			<RingHalf size={size} thickness={thickness} color={color} />
			<RingHalf side="bottom" size={size} thickness={thickness} color={color} />
		</animated.group>
	);
};

export default BracketRing;
