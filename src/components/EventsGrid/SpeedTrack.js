import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { COLORS } from "$/constants";
import { useMousePositionOverElement, usePointerUpHandler } from "$/hooks";
import { changeLaserSpeed } from "$/store/actions";
import { getTrackSpeedAtBeat, makeGetEventsForTrack } from "$/store/reducers/editor-entities.reducer/events-view.reducer";
import { getSelectedEventEditMode } from "$/store/reducers/editor.reducer";
import { EventEditMode } from "$/types";
import { normalize, range } from "$/utils";
import { getYForSpeed } from "./EventsGrid.helpers";

import SpeedTrackEvent from "./SpeedTrackEvent";

const NUM_OF_SPEEDS = 7;
const INITIAL_TENTATIVE_EVENT = {
	id: "tentative",
	beatNum: null,
	laserSpeed: null,
	visible: false,
};

const SpeedTrack = ({ trackId, width, height, startBeat, numOfBeatsToShow, cursorAtBeat, isDisabled, areLasersLocked, ...delegated }) => {
	const getEventsForTrack = makeGetEventsForTrack(trackId);
	const events = useSelector(getEventsForTrack);
	const startSpeed = useSelector((state) => getTrackSpeedAtBeat(state, trackId, startBeat));
	const endSpeed = useSelector((state) => getTrackSpeedAtBeat(state, trackId, startBeat + numOfBeatsToShow));
	const selectedEditMode = useSelector(getSelectedEventEditMode);
	const dispatch = useDispatch();
	const [tentativeEvent, setTentativeEvent] = React.useState(INITIAL_TENTATIVE_EVENT);

	const commitChanges = React.useCallback(() => {
		dispatch(changeLaserSpeed({ trackId, beatNum: tentativeEvent.beatNum, speed: tentativeEvent.laserSpeed, areLasersLocked }));

		setTentativeEvent(INITIAL_TENTATIVE_EVENT);
	}, [trackId, tentativeEvent, areLasersLocked, dispatch]);

	usePointerUpHandler(tentativeEvent.visible, commitChanges);

	const ref = useMousePositionOverElement(
		(_, y) => {
			// We don't care about x, since we already have that under `cursorAtBeat`.
			// We need to know which vertical bar they're closest to.
			// `y` will be a number from 0 to `height`, where 0 is the top and `height`
			// is the bottom. Start by flipping this, since we want speed to increase
			// from bottom to top.
			const invertedY = height - y;
			const speed = Math.ceil(invertedY / (NUM_OF_SPEEDS - 2));

			if (speed !== tentativeEvent.laserSpeed) {
				setTentativeEvent({
					...tentativeEvent,
					laserSpeed: speed,
				});
			}
		},
		{ boxDependencies: [height] },
	);

	const handlePointerDown = (ev) => {
		if (isDisabled) {
			return;
		}

		if (ev.button !== 0 || selectedEditMode !== EventEditMode.PLACE) {
			return;
		}

		setTentativeEvent({
			...tentativeEvent,
			beatNum: cursorAtBeat,
			visible: true,
		});
	};

	const plottablePoints = [
		{
			x: 0,
			y: getYForSpeed(height, startSpeed),
		},
	];

	events.forEach((event, index) => {
		const previousY = plottablePoints[plottablePoints.length - 1].y;

		const x = normalize(event.beatNum, startBeat, startBeat + numOfBeatsToShow, 0, width);

		plottablePoints.push(
			{
				x: x,
				y: previousY,
			},
			{
				x: x,
				y: getYForSpeed(height, event.laserSpeed),
			},
		);
	});

	plottablePoints.push(
		{
			x: width,
			y: getYForSpeed(height, endSpeed),
		},
		{
			x: width,
			y: height,
		},
		{
			x: 0,
			y: height,
		},
	);

	return (
		<Wrapper ref={ref} style={{ height }} isDisabled={isDisabled} onPointerDown={handlePointerDown} onContextMenu={(ev) => ev.preventDefault()}>
			<Svg width={width} height={height}>
				{/* Background 8 vertical lines, indicating the "levels" */}
				{!isDisabled && (
					<Background>
						{range(NUM_OF_SPEEDS + 1).map((i) => (
							<line key={i} x1={0} y1={getYForSpeed(height, i)} x2={width} y2={getYForSpeed(height, i)} strokeWidth={1} stroke={COLORS.blueGray[700]} style={{ opacity: 0.6 }} />
						))}
					</Background>
				)}

				{/*
          The fill for our graph area, showing easily where the current speed
          is at.
        */}
				<polyline
					points={plottablePoints.reduce((acc, point) => {
						return `${acc} ${point.x},${point.y}`;
					}, "")}
					stroke="white"
					strokeWidth="0.2"
					fill={COLORS.green[500]}
					opacity={0.5}
				/>

				{/*
          We also want to add little circles on every event. This'll allow the
          user to drag and change the position of events, as well as delete
          events they no longer want
        */}
				{events.map((event) => (
					<SpeedTrackEvent key={event.id} event={event} trackId={trackId} startBeat={startBeat} endBeat={startBeat + numOfBeatsToShow} parentWidth={width} parentHeight={height} areLasersLocked={areLasersLocked} />
				))}

				{tentativeEvent.visible && <SpeedTrackEvent event={tentativeEvent} trackId={trackId} startBeat={startBeat} endBeat={startBeat + numOfBeatsToShow} parentWidth={width} parentHeight={height} areLasersLocked={areLasersLocked} />}
			</Svg>
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

const Svg = styled.svg`
  position: relative;
  display: block;
`;

const Background = styled.g``;

export default SpeedTrack;
