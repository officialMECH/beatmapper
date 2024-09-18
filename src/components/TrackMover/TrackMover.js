import { a, useSpring } from "@react-spring/three";
import { useSelector } from "react-redux";

import { getAnimateBlockMotion, getBeatDepth, getCursorPositionInBeats } from "$/store/reducers/navigation.reducer";

const TrackMover = ({ children }) => {
	const cursorPositionInBeats = useSelector(getCursorPositionInBeats);
	const beatDepth = useSelector(getBeatDepth);
	const animateBlockMotion = useSelector(getAnimateBlockMotion);

	const zPosition = cursorPositionInBeats * beatDepth;

	const spring = useSpring({
		zPosition,
		immediate: !animateBlockMotion,
		config: {
			tension: 360,
			friction: 22,
			mass: 0.4,
		},
	});

	return <a.group position={spring.zPosition.to((interpolated) => [0, 0, interpolated])}>{children}</a.group>;
};

export default TrackMover;
