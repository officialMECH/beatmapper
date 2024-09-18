const initialState = {
	data: null,
	zoomAmount: 0,
	zoomCursorPosition: null,
};

export default function songReducer(state = initialState, action = undefined) {
	switch (action.type) {
		case "FINISH_LOADING_SONG":
		case "RELOAD_WAVEFORM": {
			const { waveformData } = action.payload;

			return {
				...state,
				data: waveformData,
				zoomAmount: 0,
				zoomCursorPosition: null,
			};
		}

		case "ZOOM_WAVEFORM": {
			const { amount } = action.payload;
			let newWaveformZoom = state.waveformZoom + amount;

			// `0` is the default zoom, which means that there's 0% zoom.
			// We don't want to allow negative zoom.
			// I might also want to add a max zoom, but I'm gonna wait and see on
			// that.
			newWaveformZoom = Math.max(newWaveformZoom, 0);

			return {
				...state,
				waveformZoom: newWaveformZoom,
			};
		}

		case "LEAVE_EDITOR": {
			return initialState;
		}

		default:
			return state;
	}
}
