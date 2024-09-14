import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { COLORS } from "$/constants";
import { usePointerUpHandler } from "$/hooks";
import * as actions from "$/store/actions";
import { makeGetEventsForTrack, makeGetInitialTrackLightingColorType } from "$/store/reducers/editor-entities.reducer/events-view.reducer";
import { getSelectedEventColor, getSelectedEventEditMode, getSelectedEventTool } from "$/store/reducers/editor.reducer";
import { getSelectedSong } from "$/store/reducers/songs.reducer";
import { App, EventEditMode, EventTool } from "$/types";
import { getBackgroundBoxes } from "./BlockTrack.helpers";

import BackgroundBox from "./BackgroundBox";
import EventBlock from "./EventBlock";

const BlockTrack = ({ song, trackId, width, height, startBeat, numOfBeatsToShow, cursorAtBeat, events, areLasersLocked, isDisabled, selectedTool, selectedColorType, selectedEditMode, initialTrackLightingColorType, placeEvent }) => {
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

		return [trackId, cursorAtBeat, eventType, eventColorType, undefined, areLasersLocked];
	};

	const handleClickTrack = () => {
		placeEvent(...getPropsForPlacedEvent());
	};

	React.useEffect(() => {
		if (selectedEditMode === EventEditMode.PLACE && mouseButtonDepressed === "left") {
			// TODO: Technically this should be a new action, bulkPlaceEVent, so that
			// they can all be undoed in 1 step
			placeEvent(...getPropsForPlacedEvent());
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

const makeMapStateToProps = (state, { trackId }) => {
	const getEventsForTrack = makeGetEventsForTrack(trackId);
	const getInitialTrackLightingColorType = makeGetInitialTrackLightingColorType(trackId);

	const mapStateToProps = (state) => {
		const song = getSelectedSong(state);
		const events = getEventsForTrack(state);
		const selectedEditMode = getSelectedEventEditMode(state);
		const selectedTool = getSelectedEventTool(state);
		const selectedColorType = getSelectedEventColor(state);

		const initialTrackLightingColorType = getInitialTrackLightingColorType(state);

		return {
			song,
			events,
			selectedEditMode,
			selectedTool,
			selectedColorType,
			initialTrackLightingColorType,
		};
	};

	return mapStateToProps;
};

const mapDispatchToProps = {
	placeEvent: actions.placeEvent,
};

export default connect(makeMapStateToProps, mapDispatchToProps)(React.memo(BlockTrack));
