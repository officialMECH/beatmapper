import { a, useSpring } from "@react-spring/three";
import { connect } from "react-redux";

import { getBeatDepth, getCursorPositionInBeats } from "$/store/reducers/navigation.reducer";

const TrackMover = ({ cursorPositionInBeats, beatDepth, animateBlockMotion, children }) => {
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

const mapStateToProps = (state) => {
	return {
		cursorPositionInBeats: getCursorPositionInBeats(state),
		beatDepth: getBeatDepth(state),
		animateBlockMotion: state.navigation.animateBlockMotion,
	};
};

export default connect(mapStateToProps)(TrackMover);
