import { SNAPPING_INCREMENTS } from "$/constants";
import { convertMillisecondsToBeats } from "$/helpers/audio.helpers";
import { getSelectedSong } from "./songs.reducer";

const initialState = {
	isLoading: false,
	isPlaying: false,
	duration: null,
	snapTo: 0.5,
	cursorPosition: 0,
	animateBlockMotion: true,
	animateRingMotion: true,
	playbackRate: 1,
	beatDepth: 9,
	volume: 0.75,
	playNoteTick: false,
};

export default function navigationReducer(state = initialState, action = undefined) {
	switch (action.type) {
		case "START_LOADING_SONG": {
			return {
				...state,
				isLoading: true,
			};
		}

		case "FINISH_LOADING_SONG": {
			const { waveformData, song } = action.payload;
			const durationInMs = waveformData.duration * 1000;

			return {
				...state,
				cursorPosition: song.offset,
				isLoading: false,
				duration: durationInMs,
			};
		}

		case "RELOAD_WAVEFORM": {
			const { waveformData } = action.payload;
			const durationInMs = waveformData.duration * 1000;

			return {
				...state,
				isLoading: false,
				duration: durationInMs,
			};
		}

		case "UPDATE_SONG_DETAILS": {
			const { offset } = action.payload;

			return {
				...state,
				cursorPosition: offset,
			};
		}

		case "START_PLAYING": {
			return {
				...state,
				isPlaying: true,
				animateBlockMotion: false,
				animateRingMotion: true,
			};
		}

		case "PAUSE_PLAYING": {
			return {
				...state,
				isPlaying: false,
				animateBlockMotion: true,
				animateRingMotion: false,
			};
		}
		case "STOP_PLAYING": {
			const { offset } = action.payload;
			return {
				...state,
				isPlaying: false,
				animateBlockMotion: false,
				animateRingMotion: false,
				cursorPosition: offset,
			};
		}

		case "ADJUST_CURSOR_POSITION": {
			const { newCursorPosition } = action.payload;
			return {
				...state,
				cursorPosition: newCursorPosition,
			};
		}

		case "TICK": {
			const { timeElapsed } = action.payload;
			return {
				...state,
				cursorPosition: timeElapsed,
				animateRingMotion: true,
			};
		}

		case "SCRUB_WAVEFORM": {
			const { newOffset } = action.payload;
			return {
				...state,
				cursorPosition: newOffset,
				animateBlockMotion: false,
				animateRingMotion: false,
			};
		}

		case "JUMP_TO_BEAT": {
			const { pauseTrack, animateJump } = action.payload;
			// In some cases, we want to pause the track when jumping.
			// In others, we inherit whatever the current value is.
			const isPlaying = pauseTrack ? false : state.isPlaying;

			return {
				...state,
				isPlaying,
				animateBlockMotion: !!animateJump,
				animateRingMotion: false,
			};
		}

		case "SELECT_ALL_IN_RANGE": {
			return {
				...state,
				isPlaying: false,
				animateBlockMotion: false,
			};
		}

		case "SEEK_FORWARDS":
		case "SEEK_BACKWARDS": {
			return {
				...state,
				animateBlockMotion: false,
				animateRingMotion: false,
			};
		}

		case "SCROLL_THROUGH_SONG": {
			// The actual cursor-position for this is done with an
			// `ADJUST_CURSOR_POSITION` dispatch.
			return {
				...state,
				animateBlockMotion: true,
				animateRingMotion: false,
			};
		}

		case "SKIP_TO_START": {
			const { offset } = action.payload;
			return {
				...state,
				animateBlockMotion: false,
				animateRingMotion: false,
				cursorPosition: offset,
			};
		}
		case "SKIP_TO_END": {
			return {
				...state,
				animateBlockMotion: false,
				animateRingMotion: false,
				cursorPosition: state.duration,
			};
		}

		case "UPDATE_VOLUME": {
			const { volume } = action.payload;
			return {
				...state,
				volume: volume,
			};
		}

		case "UPDATE_PLAYBACK_SPEED": {
			const { playbackRate } = action.payload;
			return {
				...state,
				playbackRate: playbackRate,
			};
		}

		case "UPDATE_BEAT_DEPTH": {
			const { beatDepth } = action.payload;
			return {
				...state,
				beatDepth: beatDepth,
				animateBlockMotion: false,
			};
		}

		case "CHANGE_SNAPPING": {
			const { newSnapTo } = action.payload;
			return {
				...state,
				snapTo: newSnapTo,
			};
		}

		case "TOGGLE_NOTE_TICK": {
			return {
				...state,
				playNoteTick: !state.playNoteTick,
			};
		}

		case "INCREMENT_SNAPPING":
		case "DECREMENT_SNAPPING": {
			const currentSnappingIncrementIndex = SNAPPING_INCREMENTS.findIndex((increment) => increment.value === state.snapTo);

			// This shouldn't be possible, but if somehow we don't have a recognized
			// interval, just reset to 1.
			if (currentSnappingIncrementIndex === -1) {
				return {
					...state,
					snapTo: 1,
				};
			}

			const nextSnappingIndex = action.type === "INCREMENT_SNAPPING" ? currentSnappingIncrementIndex + 1 : currentSnappingIncrementIndex - 1;
			const nextSnappingIncrement = SNAPPING_INCREMENTS[nextSnappingIndex];

			// If we're at one end of the scale and we try to push beyond it,
			// we'll hit an undefined. Do nothing in those cases (no wrapping around
			// desired).
			if (!nextSnappingIncrement) {
				return state;
			}

			return {
				...state,
				snapTo: nextSnappingIncrement.value,
			};
		}

		case "LEAVE_EDITOR": {
			return {
				...state,
				cursorPosition: 0,
				isPlaying: false,
				duration: null,
			};
		}

		default:
			return state;
	}
}

export const getIsLoading = (state) => state.navigation.isLoading;
export const getIsPlaying = (state) => state.navigation.isPlaying;
export const getDuration = (state) => state.navigation.duration;
export const getSnapTo = (state) => state.navigation.snapTo;
export const getCursorPosition = (state) => state.navigation.cursorPosition;
export const getPlaybackRate = (state) => state.navigation.playbackRate;
export const getBeatDepth = (state) => state.navigation.beatDepth;
export const getVolume = (state) => state.navigation.volume;
export const getPlayNoteTick = (state) => state.navigation.playNoteTick;
export const getAnimateBlockMotion = (state) => state.navigation.animateBlockMotion;
export const getAnimateRingMotion = (state) => state.navigation.animateRingMotion;

export const getCursorPositionInBeats = (state) => {
	const song = getSelectedSong(state);

	if (!song) {
		return null;
	}

	return convertMillisecondsToBeats(getCursorPosition(state) - song.offset, song.bpm);
};
export const getDurationInBeats = (state) => {
	const song = getSelectedSong(state);
	return convertMillisecondsToBeats(getDuration(state), song.bpm);
};
