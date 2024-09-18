import Color from "color";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { COLORS } from "$/constants";
import { getColorForItem } from "$/helpers/colors.helpers";
import { bulkDeleteEvent, deleteEvent, deselectEvent, selectEvent, switchEventColor } from "$/store/actions";
import { getSelectedEventEditMode } from "$/store/reducers/editor.reducer";
import { getSelectedSong } from "$/store/reducers/songs.reducer";
import { App, EventEditMode } from "$/types";
import { normalize } from "$/utils";

import UnstyledButton from "../UnstyledButton";

const BLOCK_WIDTH = 7;

const getBackgroundForEvent = (event, song) => {
	const color = getColorForItem(event.colorType || event.type, song);

	switch (event.type) {
		case App.EventType.ON:
		case App.EventType.OFF:
		case App.EventType.TRIGGER: {
			// On/off are solid colors
			return color;
		}

		case App.EventType.FLASH: {
			const brightColor = Color(color).lighten(0.4).hsl();
			const semiTransparentColor = Color(color)
				.darken(0.5)

				.hsl();
			return `linear-gradient(90deg, ${semiTransparentColor}, ${brightColor})`;
		}

		case App.EventType.FADE: {
			const brightColor = Color(color).lighten(0.4).hsl();

			const semiTransparentColor = Color(color)
				.darken(0.5)

				.rgb();
			return `linear-gradient(-90deg, ${semiTransparentColor}, ${brightColor})`;
		}

		default:
			throw new Error(`Unrecognized type: ${event.type}`);
	}
};

const EventBlock = ({ event, trackWidth, startBeat, numOfBeatsToShow, deleteOnHover, areLasersLocked }) => {
	const song = useSelector(getSelectedSong);
	const selectedEditMode = useSelector(getSelectedEventEditMode);
	const dispatch = useDispatch();

	const offset = normalize(event.beatNum, startBeat, numOfBeatsToShow + startBeat, 0, trackWidth);

	const centeredOffset = offset - BLOCK_WIDTH / 2;

	const background = getBackgroundForEvent(event, song);

	return (
		<Wrapper
			style={{ transform: `translateX(${centeredOffset}px)`, background }}
			onClick={(ev) => ev.stopPropagation()}
			onContextMenu={(ev) => ev.preventDefault()}
			onPointerOver={(ev) => {
				if (deleteOnHover) {
					dispatch(bulkDeleteEvent({ id: event.id, trackId: event.trackId, areLasersLocked }));
				}
			}}
			onPointerDown={(ev) => {
				// When in "select" mode, clicking the grid creates a selection box.
				// We don't want to do that when the user clicks directly on a block.
				// In "place" mode, we need the event to propagate to enable bulk
				// delete.
				if (selectedEditMode === EventEditMode.SELECT) {
					ev.stopPropagation();
				}

				// prettier-ignore
				const clickType = ev.button === 0 ? "left" : ev.button === 1 ? "middle" : ev.button === 2 ? "right" : undefined;

				if (clickType === "left") {
					const actionToSend = event.selected ? deselectEvent : selectEvent;
					dispatch(actionToSend({ id: event.id, trackId: event.trackId }));
				} else if (clickType === "middle") {
					dispatch(switchEventColor({ id: event.id, trackId: event.trackId }));
				} else if (clickType === "right") {
					dispatch(deleteEvent({ id: event.id, trackId: event.trackId, areLasersLocked }));
				}

				if (ev.buttons === 2) {
					dispatch(deleteEvent({ id: event.id, trackId: event.trackId, areLasersLocked }));
				}
			}}
		>
			{event.selected && <SelectedGlow />}
		</Wrapper>
	);
};

const Wrapper = styled(UnstyledButton)`
  width: ${BLOCK_WIDTH}px;
  height: 100%;
  position: absolute;
  border-radius: ${BLOCK_WIDTH / 2}px;
`;

const SelectedGlow = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${COLORS.yellow[500]};
  border-radius: ${BLOCK_WIDTH / 2}px;
  opacity: 0.6;
`;

export default React.memo(EventBlock);
