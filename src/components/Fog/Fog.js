import { useSelector } from "react-redux";

import { getGraphicsLevel } from "$/store/selectors";

const Fog = ({ renderForGraphics, strength }) => {
	const graphicsLevel = useSelector(getGraphicsLevel);

	if (graphicsLevel !== renderForGraphics) {
		return null;
	}

	return <fogExp2 attach="fog" args={[0x000000, strength]} />;
};

export default Fog;
