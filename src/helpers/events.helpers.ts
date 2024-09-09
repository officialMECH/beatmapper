import { v1 as uuid } from "uuid";

import { LIGHT_EVENTS_ARRAY, LIGHT_EVENT_TYPES, TRACK_IDS_ARRAY, TRACK_ID_MAP } from "$/constants";
import type { Event, LaserSpeedEvent, LightingEvent, RingEvent } from "$/types";

interface JsonEvent {
	_time: number;
	_type: number;
	_value: number;
}

/**
 * WARNING: This method mutates the `events` array supplied.
 * This is done because it is called within an Immer `produce` call, which uses
 * proxies to avoid actually doing mutation.
 * But, if you call this from a foreign context, you won't get that, so be
 * wary.
 *
 * This is the kind of thing I'm doing only because this isn't a shared
 * codebase :D
 */
export const nudgeEvents = (direction: "forwards" | "backwards", amount: number, events: Array<LightingEvent>) => {
	const sign = direction === "forwards" ? 1 : -1;

	return events.forEach((event) => {
		if (!event.selected) {
			return;
		}

		event.beatNum += amount * sign;
	});
};

const convertLightingEventToJson = (event: LightingEvent): JsonEvent => {
	// `Off` events have no color attribute, since there is no way to tell when
	// importing whether it was supposed to be red or blue.
	const value = event.colorType ? LIGHT_EVENT_TYPES[event.colorType][event.type] : 0;

	return {
		_time: event.beatNum,
		_type: TRACK_ID_MAP[event.trackId],
		_value: value,
	};
};

const convertLaserSpeedEventToJson = (event: LaserSpeedEvent): JsonEvent => {
	const type = TRACK_ID_MAP[event.trackId];

	return {
		_time: event.beatNum,
		_type: type,
		_value: event.laserSpeed,
	};
};
const convertRotationEventToJson = (event: RingEvent): JsonEvent => {
	const type = TRACK_ID_MAP[event.trackId];

	return {
		_time: event.beatNum,
		_type: type,
		_value: 0,
	};
};

export const convertEventsToExportableJson = (events: Array<Event>): Array<JsonEvent> => {
	return events.map((event) => {
		if (event.trackId === "laserSpeedLeft" || event.trackId === "laserSpeedRight") {
			return convertLaserSpeedEventToJson(event as LaserSpeedEvent);
		}
		if (event.trackId === "smallRing" || event.trackId === "largeRing") {
			return convertRotationEventToJson(event as RingEvent);
		}
		return convertLightingEventToJson(event as LightingEvent);
	});
};

export const convertEventsToRedux = (events: Array<JsonEvent>) => {
	return events.map((event) => {
		const id = uuid();
		const trackId = TRACK_IDS_ARRAY[event._type];
		const beatNum = event._time;

		// Lighting event
		if (event._type <= 4) {
			const lightingType = LIGHT_EVENTS_ARRAY[event._value];
			const colorType = event._value === 0 ? undefined : event._value < 4 ? "blue" : "red";

			return {
				id,
				trackId,
				beatNum,
				type: lightingType,
				colorType,
			};
		}
		if (trackId === "smallRing" || trackId === "largeRing") {
			return {
				id,
				trackId,
				beatNum,
				type: "rotate",
			};
		}
		if (trackId === "laserSpeedLeft" || trackId === "laserSpeedRight") {
			const laserSpeed = event._value;

			return {
				id,
				trackId,
				beatNum,
				laserSpeed,
			};
		}
		throw new Error(`Unrecognized event track: ${JSON.stringify(event, null, 2)}`);
	});
};
