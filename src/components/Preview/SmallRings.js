import React from "react";
import { useSelector } from "react-redux";

import { convertMillisecondsToBeats } from "$/helpers/audio.helpers";
import { useOnChange } from "$/hooks";
import { getAnimateRingMotion, getCursorPositionInBeats, getGraphicsLevel, getTracks, getUsableProcessingDelay } from "$/store/selectors";
import { App, Quality } from "$/types";
import { range } from "$/utils";
import { findMostRecentEventInTrack } from "./Preview.helpers";

import BracketRing from "./BracketRing";

const INITIAL_ROTATION = Math.PI * 0.25;
const INCREMENT_ROTATION_BY = Math.PI * 0.5;
const DISTANCE_BETWEEN_RINGS_MIN = 3;
const DISTANCE_BETWEEN_RINGS_MAX = 10;

const SmallRings = ({ song, isPlaying }) => {
	const lastZoomEvent = useSelector((state) => {
		if (!song) {
			return;
		}

		const tracks = getTracks(state);

		const zoomTrackId = App.TrackId[9];

		const zoomEvents = tracks[zoomTrackId];

		const currentBeat = getCursorPositionInBeats(state);
		const processingDelay = getUsableProcessingDelay(state);

		const processingDelayInBeats = convertMillisecondsToBeats(processingDelay, song.bpm);

		const lastZoomEvent = findMostRecentEventInTrack(zoomEvents, currentBeat, processingDelayInBeats);
		return lastZoomEvent;
	});
	const lastRotationEvent = useSelector((state) => {
		const tracks = getTracks(state);

		const rotationTrackId = App.TrackId[8];

		const rotationEvents = tracks[rotationTrackId];

		const currentBeat = getCursorPositionInBeats(state);
		const processingDelay = getUsableProcessingDelay(state);

		const processingDelayInBeats = convertMillisecondsToBeats(processingDelay, song.bpm);

		const lastRotationEvent = findMostRecentEventInTrack(rotationEvents, currentBeat, processingDelayInBeats);
		return lastRotationEvent;
	});
	const numOfRings = useSelector((state) => {
		const graphicsLevel = getGraphicsLevel(state);

		let numOfRings;
		switch (graphicsLevel) {
			case Quality.HIGH: {
				numOfRings = 16;
				break;
			}
			case Quality.MEDIUM: {
				numOfRings = 12;
				break;
			}
			case Quality.LOW: {
				numOfRings = 8;
				break;
			}
		}

		return numOfRings;
	});
	const animateRingMotion = useSelector(getAnimateRingMotion);

	const lastZoomEventId = lastZoomEvent ? lastZoomEvent.id : null;
	const lastRotationEventId = lastRotationEvent ? lastRotationEvent.id : null;
	const firstRingOffset = -8;

	const [distanceBetweenRings, setDistanceBetweenRings] = React.useState(DISTANCE_BETWEEN_RINGS_MIN);

	const [rotationRatio, setRotationRatio] = React.useState(0.1);

	useOnChange(() => {
		if (!isPlaying) {
			return;
		}

		if (lastZoomEventId) {
			setDistanceBetweenRings(distanceBetweenRings === DISTANCE_BETWEEN_RINGS_MAX ? DISTANCE_BETWEEN_RINGS_MIN : DISTANCE_BETWEEN_RINGS_MAX);
		}
	}, lastZoomEventId);

	// TODO: Custom hook that is shared with LArgeRings
	useOnChange(() => {
		if (!isPlaying || !lastRotationEventId) {
			return;
		}

		const shouldChangeDirection = Math.random() < 0.5;
		const directionMultiple = shouldChangeDirection ? 1 : -1;

		setRotationRatio(rotationRatio + INCREMENT_ROTATION_BY * directionMultiple);
	}, lastRotationEventId);

	return range(numOfRings).map((index) => <BracketRing key={index} size={16} thickness={0.4} y={-2} z={firstRingOffset + distanceBetweenRings * index * -1} rotation={INITIAL_ROTATION + index * rotationRatio} color="#1C1C1C" />);
};

export default SmallRings;
