import { v1 as uuid } from "uuid";

import { LIGHT_EVENTS_ARRAY, LIGHT_EVENT_TYPES, TRACK_IDS_ARRAY, TRACK_ID_MAP } from "$/constants";
import { App } from "$/types";

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
export const nudgeEvents = (direction: "forwards" | "backwards", amount: number, events: Array<App.LightingEvent>) => {
	const sign = direction === "forwards" ? 1 : -1;

	return events.forEach((event) => {
		if (!event.selected) {
			return;
		}

		event.beatNum += amount * sign;
	});
};

const convertLightingEventToJson = (event: App.LightingEvent): JsonEvent => {
	// `Off` events have no color attribute, since there is no way to tell when
	// importing whether it was supposed to be red or blue.
	const value = event.colorType ? LIGHT_EVENT_TYPES[event.colorType][event.type] : 0;

	return {
		_time: event.beatNum,
		_type: TRACK_ID_MAP[event.trackId],
		_value: value,
	};
};

const convertLaserSpeedEventToJson = (event: App.LaserSpeedEvent): JsonEvent => {
	const type = TRACK_ID_MAP[event.trackId];

	return {
		_time: event.beatNum,
		_type: type,
		_value: event.laserSpeed,
	};
};
const convertRotationEventToJson = (event: App.RingEvent): JsonEvent => {
	const type = TRACK_ID_MAP[event.trackId];

	return {
		_time: event.beatNum,
		_type: type,
		_value: 0,
	};
};

export const convertEventsToExportableJson = (events: Array<App.Event>): Array<JsonEvent> => {
	return events.map((event) => {
		if (event.trackId === App.TrackId[12] || event.trackId === App.TrackId[13]) {
			return convertLaserSpeedEventToJson(event as App.LaserSpeedEvent);
		}
		if (event.trackId === App.TrackId[8] || event.trackId === App.TrackId[9]) {
			return convertRotationEventToJson(event as App.RingEvent);
		}
		return convertLightingEventToJson(event as App.LightingEvent);
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
			const colorType = event._value === 0 ? undefined : event._value < 4 ? App.EventColorType.SECONDARY : App.EventColorType.PRIMARY;

			return {
				id,
				trackId,
				beatNum,
				type: lightingType,
				colorType,
			};
		}
		if (trackId === App.TrackId[8] || trackId === App.TrackId[9]) {
			return {
				id,
				trackId,
				beatNum,
				type: App.EventType.TRIGGER,
			};
		}
		if (trackId === App.TrackId[12] || trackId === App.TrackId[13]) {
			const laserSpeed = event._value;

			return {
				id,
				trackId,
				beatNum,
				laserSpeed,
			};
		}
		throw new Error(`Unrecognized event track: ${JSON.stringify(event._type, null, 2)}`);
	});
};
