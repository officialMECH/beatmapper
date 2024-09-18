import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { COLORS } from "$/constants";
import { usePointerUpHandler } from "$/hooks";
import { placeEvent } from "$/store/actions";
import { makeGetEventsForTrack, makeGetInitialTrackLightingColorType } from "$/store/reducers/editor-entities.reducer/events-view.reducer";
import { getSelectedEventColor, getSelectedEventEditMode, getSelectedEventTool } from "$/store/reducers/editor.reducer";
import { getSelectedSong } from "$/store/reducers/songs.reducer";
import { App, EventEditMode, EventTool } from "$/types";
import { getBackgroundBoxes } from "./BlockTrack.helpers";

import BackgroundBox from "./BackgroundBox";
import EventBlock from "./EventBlock";

const BlockTrack = ({ trackId, width, height, startBeat, numOfBeatsToShow, cursorAtBeat, areLasersLocked, isDisabled }) => {
	const getEventsForTrack = makeGetEventsForTrack(trackId);
	const getInitialTrackLightingColorType = makeGetInitialTrackLightingColorType(trackId);
	const song = useSelector(getSelectedSong);
	const events = useSelector(getEventsForTrack);
	const selectedEditMode = useSelector(getSelectedEventEditMode);
	const selectedTool = useSelector(getSelectedEventTool);
	const selectedColorType = useSelector(getSelectedEventColor);
	const initialTrackLightingColorType = useSelector(getInitialTrackLightingColorType);
	const dispatch = useDispatch();

	const [mouseButtonDepressed, setMouseButtonDepressed] = React.useState(null);

	const handlePointerUp = React.useCallback(() => {
		setMouseButtonDepressed(null);
	}, []);

	usePointerUpHandler(!!mouseButtonDepressed, handlePointerUp);

	const getPropsForPlacedEvent = () => {
		const isRingEvent = trackId === App.TrackId[8] || trackId === App.TrackId[9];
		const eventType = isRingEvent ? App.EventType.TRIGGER : selectedTool;

		let eventColorType = selectedColorType;
		if (isRingEvent || selectedTool === EventTool.OFF) {
			eventColorType = undefined;
		}

		return { trackId, beatNum: cursorAtBeat, eventType, eventColorType, eventLaserSpeed: undefined, areLasersLocked };
	};

	const handleClickTrack = () => {
		dispatch(placeEvent({ ...getPropsForPlacedEvent() }));
	};

	React.useEffect(() => {
		if (selectedEditMode === EventEditMode.PLACE && mouseButtonDepressed === "left") {
			// TODO: Technically this should be a new action, bulkPlaceEVent, so that
			// they can all be undoed in 1 step
			dispatch(placeEvent({ ...getPropsForPlacedEvent() }));
		}
		// eslint-disable-next-line
	}, [selectedEditMode, cursorAtBeat]);

	const backgroundBoxes = getBackgroundBoxes(events, trackId, initialTrackLightingColorType, startBeat, numOfBeatsToShow);

	return (
		<Wrapper
			style={{ height }}
			isDisabled={isDisabled}
			onPointerDown={(ev) => {
				if (isDisabled || selectedEditMode === EventEditMode.SELECT) {
					return;
				}

				if (ev.buttons === 1) {
					handleClickTrack();
					setMouseButtonDepressed("left");
				} else if (ev.buttons === 2) {
					setMouseButtonDepressed("right");
				}
			}}
			onContextMenu={(ev) => ev.preventDefault()}
		>
			{backgroundBoxes.map((box) => (
				<BackgroundBox key={box.id} song={song} box={box} startBeat={startBeat} numOfBeatsToShow={numOfBeatsToShow} />
			))}

			{events.map((event) => {
				return <EventBlock key={event.id} event={event} trackWidth={width} trackId={trackId} startBeat={startBeat} numOfBeatsToShow={numOfBeatsToShow} deleteOnHover={selectedEditMode === EventEditMode.PLACE && mouseButtonDepressed === "right"} areLasersLocked={areLasersLocked} />;
			})}
		</Wrapper>
	);
};

const Wrapper = styled.div`
  position: relative;
  border-bottom: 1px solid ${COLORS.blueGray[400]};
  opacity: ${(p) => p.isDisabled && 0.5};
  cursor: ${(p) => p.isDisabled && "not-allowed"};
  background-color: ${(p) => p.isDisabled && "rgba(255,255,255,0.2)"};

  &:last-of-type {
    border-bottom: none;
  }
`;

export default React.memo(BlockTrack);
