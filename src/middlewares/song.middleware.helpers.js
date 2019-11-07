import webAudioBuilder from 'waveform-data/webaudio';

import { adjustCursorPosition } from '../actions';
import { convertFileToArrayBuffer } from '../helpers/file.helpers';
import {
  convertBeatsToMilliseconds,
  convertMillisecondsToBeats,
} from '../helpers/audio.helpers';
import { getNotes } from '../reducers/editor-entities.reducer/notes-view.reducer';
import { getPlayNoteTick } from '../reducers/navigation.reducer';
import { getSelectedSong } from '../reducers/songs.reducer';
import {
  getIsLockedToCurrentWindow,
  getBeatsPerZoomLevel,
} from '../reducers/editor.reducer';
import { floorToNearest } from '../utils';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export const stopAndRewindAudio = (audioElem, offset) => {
  audioElem.currentTime = (offset || 0) / 1000;
};

export const generateWaveformForSongFile = async file => {
  // Loading an array buffer consumes it, weirdly. I don't believe that
  // this is a mistake I'm making, it appears to be a part of the Web
  // Audio API. So, we need to reload the buffer.
  const arrayBuffer = await convertFileToArrayBuffer(file);

  // Generate the waveform, for scrubbing:
  const audioContext = new AudioContext();

  return new Promise((resolve, reject) => {
    webAudioBuilder(audioContext, arrayBuffer, (err, waveform) => {
      if (err) {
        reject(err);
      }

      resolve(waveform);
    });
  });
};

export const triggerTickerIfNecessary = (
  state,
  currentBeat,
  lastBeat,
  ticker
) => {
  const song = getSelectedSong(state);

  const playNoteTick = getPlayNoteTick(state);

  if (playNoteTick) {
    // TODO: pull from state, allow users to customize it in a settings
    // modal or similar
    const processingDelay = 60;
    const delayInBeats = convertMillisecondsToBeats(processingDelay, song.bpm);

    const anyNotesWithinTimespan = getNotes(state).some(
      note =>
        note._time - delayInBeats >= lastBeat &&
        note._time - delayInBeats < currentBeat &&
        note._type !== 3 // Don't tick for mines
    );

    if (anyNotesWithinTimespan) {
      ticker.trigger();
    }
  }
};

// TODO: Pull this in from state.
// It should be some multiple of the state value.
const PROCESSING_DELAY = 40;

export const calculateIfPlaybackShouldBeCommandeered = (
  state,
  currentBeat,
  lastBeat,
  audioElem
) => {
  const song = getSelectedSong(state);

  const isLockedToCurrentWindow = getIsLockedToCurrentWindow(state);
  const beatsPerZoomLevel = getBeatsPerZoomLevel(state);

  // Figure out how much time lasts between frames, on average.
  const currentTime = convertBeatsToMilliseconds(currentBeat, song.bpm);
  const lastBeatTime = convertBeatsToMilliseconds(lastBeat, song.bpm);
  const deltaInMillisecondsBetweenFrames = currentTime - lastBeatTime;

  // Project when the next beat will be, based on the distance between the
  // last two beats.
  // (yes this is a hacky approximation but it seems to work).
  const nextBeat = convertMillisecondsToBeats(
    currentTime + deltaInMillisecondsBetweenFrames + PROCESSING_DELAY,
    song.bpm
  );

  const startBeatForCurrentWindow = floorToNearest(
    currentBeat,
    beatsPerZoomLevel
  );

  const startBeatForNextWindow = floorToNearest(nextBeat, beatsPerZoomLevel);

  const justExceededWindow =
    startBeatForCurrentWindow < startBeatForNextWindow &&
    deltaInMillisecondsBetweenFrames < 100;

  if (isLockedToCurrentWindow && justExceededWindow) {
    const newCursorPosition =
      convertBeatsToMilliseconds(startBeatForCurrentWindow, song.bpm) +
      song.offset;

    return newCursorPosition;
  }
};
