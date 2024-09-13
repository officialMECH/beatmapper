import { default as WaveformData } from "waveform-data";

import { convertBeatsToMilliseconds, convertMillisecondsToBeats } from "$/helpers/audio.helpers";
import { convertFileToArrayBuffer } from "$/helpers/file.helpers";
import { View } from "$/types";
import { floorToNearest } from "$/utils";
import { getNotes } from "../reducers/editor-entities.reducer/notes-view.reducer";
import { getBeatsPerZoomLevel, getIsLockedToCurrentWindow } from "../reducers/editor.reducer";
import { getPlayNoteTick } from "../reducers/navigation.reducer";
import { getSelectedSong } from "../reducers/songs.reducer";

const AudioContext = window.AudioContext || window.webkitAudioContext;

export const stopAndRewindAudio = (audioSample, offset) => {
	audioSample.setCurrentTime((offset || 0) / 1000);
};

export const generateWaveformForSongFile = async (file) => {
	// Loading an array buffer consumes it, weirdly. I don't believe that
	// this is a mistake I'm making, it appears to be a part of the Web
	// Audio API. So, we need to reload the buffer.
	const arrayBuffer = await convertFileToArrayBuffer(file);

	// Generate the waveform, for scrubbing:
	const audioContext = new AudioContext();

	return new Promise((resolve, reject) => {
		WaveformData.createFromAudio({ audio_context: audioContext, array_buffer: arrayBuffer }, (err, waveform) => {
			if (err) {
				reject(err);
			}

			resolve(waveform);
		});
	});
};

export const triggerTickerIfNecessary = (state, currentBeat, lastBeat, ticker, processingDelay) => {
	const song = getSelectedSong(state);

	const playNoteTick = getPlayNoteTick(state);

	if (playNoteTick) {
		const delayInBeats = convertMillisecondsToBeats(processingDelay, song.bpm);

		const anyNotesWithinTimespan = getNotes(state).some(
			(note) => note._time - delayInBeats >= lastBeat && note._time - delayInBeats < currentBeat && note._type !== 3, // Don't tick for mines
		);

		if (anyNotesWithinTimespan) {
			ticker.trigger();
		}
	}
};

export const calculateIfPlaybackShouldBeCommandeered = (state, currentBeat, lastBeat, processingDelay, view) => {
	if (view !== View.LIGHTSHOW) {
		return;
	}
	const song = getSelectedSong(state);

	const isLockedToCurrentWindow = getIsLockedToCurrentWindow(state);
	const beatsPerZoomLevel = getBeatsPerZoomLevel(state);

	// Figure out how much time lasts between frames, on average.
	const currentTime = convertBeatsToMilliseconds(currentBeat, song.bpm);
	const lastBeatTime = convertBeatsToMilliseconds(lastBeat, song.bpm);
	const deltaInMillisecondsBetweenFrames = currentTime - lastBeatTime;

	const processingDelayInBeats = convertMillisecondsToBeats(processingDelay, song.bpm);

	const windowForCurrentBeat = floorToNearest(currentBeat + processingDelayInBeats, beatsPerZoomLevel);
	const windowForLastBeat = floorToNearest(lastBeat + processingDelayInBeats, beatsPerZoomLevel);

	const justExceededWindow = windowForLastBeat < windowForCurrentBeat && deltaInMillisecondsBetweenFrames < 100;

	if (isLockedToCurrentWindow && justExceededWindow) {
		const newCursorPosition = convertBeatsToMilliseconds(windowForLastBeat, song.bpm) + song.offset;

		return newCursorPosition;
	}
};
