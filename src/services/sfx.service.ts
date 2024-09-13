/**
 * This mini-service wraps the AudioSample service to provide an easy-to-use
 * tick SFX.
 */

import defaultSfxPath from "../assets/sounds/tick-alt.mp3";
import { AudioSample } from "./audio.service";

export class Sfx {
	audioSample: AudioSample;
	constructor(sfxPath = defaultSfxPath) {
		this.audioSample = new AudioSample();

		fetch(sfxPath)
			.then((res) => res.arrayBuffer())
			.then((arrayBuffer) => this.audioSample.load(arrayBuffer));
	}

	trigger() {
		this.audioSample.pause();
		this.audioSample.setCurrentTime(0);
		this.audioSample.play();
	}
}
