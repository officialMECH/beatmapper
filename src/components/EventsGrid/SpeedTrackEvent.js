import { useDispatch } from "react-redux";

import { COLORS } from "$/constants";
import { deleteEvent } from "$/store/actions";
import { normalize } from "$/utils";
import { getYForSpeed } from "./EventsGrid.helpers";

const SpeedTrackEvent = ({ event, trackId, startBeat, endBeat, parentWidth, parentHeight, areLasersLocked }) => {
	const dispatch = useDispatch();

	const x = normalize(event.beatNum, startBeat, endBeat, 0, parentWidth);
	const y = getYForSpeed(parentHeight, event.laserSpeed);

	return (
		<circle
			cx={x}
			cy={y}
			r={4}
			fill={event.selected ? COLORS.yellow[500] : COLORS.green[500]}
			style={{
				cursor: "pointer",
				opacity: event.id === "tentative" ? 0.5 : 1,
			}}
			onPointerDown={(ev) => {
				if (ev.button === 2) {
					dispatch(deleteEvent({ id: event.id, trackId, areLasersLocked }));
				}
			}}
		/>
	);
};

export default SpeedTrackEvent;
