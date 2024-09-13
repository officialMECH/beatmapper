import { connect } from "react-redux";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { useBoundingBox } from "$/hooks";
import { Quality } from "$/types";
import { roundToNearest } from "$/utils";
import * as actions from "../../actions";
import { getSelectedSong } from "../../reducers/songs.reducer";
import { getGraphicsLevel } from "../../reducers/user.reducer";

import Bookmarks from "../Bookmarks";
import CenteredSpinner from "../CenteredSpinner";
import ScrubbableWaveform from "../ScrubbableWaveform";

const EditorWaveform = ({ height, view, song, waveformData, isLoadingSong, duration, cursorPosition, bookmarks, graphicsLevel, scrubWaveform }) => {
	const [ref, boundingBox] = useBoundingBox();

	// Updating this waveform is surprisingly expensive!
	// We'll throttle its rendering by rounding the cursor position for lower
	// graphics settings. Because it's a pure component, providing the same
	// cursorPosition means that the rendering will be skipped for equal values.
	let roundedCursorPosition;
	if (graphicsLevel === Quality.LOW) {
		roundedCursorPosition = roundToNearest(cursorPosition, 150);
	} else if (graphicsLevel === Quality.MEDIUM) {
		roundedCursorPosition = roundToNearest(cursorPosition, 75);
	} else {
		roundedCursorPosition = cursorPosition;
	}

	return (
		<Wrapper ref={ref}>
			{isLoadingSong && (
				<SpinnerWrapper>
					<CenteredSpinner />
				</SpinnerWrapper>
			)}
			{boundingBox && song && (
				<>
					<ScrubbableWaveform key={`${song.id}-${song.selectedDifficulty}`} view={view} width={boundingBox.width} height={height - UNIT * 2} waveformData={waveformData} duration={duration} cursorPosition={roundedCursorPosition} scrubWaveform={scrubWaveform} />
					{!isLoadingSong && <Bookmarks />}
				</>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
  position: relative;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const mapStateToProps = (state) => {
	return {
		song: getSelectedSong(state),
		waveformData: state.waveform.data,
		isLoadingSong: state.navigation.isLoading,
		duration: state.navigation.duration,
		cursorPosition: state.navigation.cursorPosition,
		graphicsLevel: getGraphicsLevel(state),
	};
};

const mapDispatchToProps = { scrubWaveform: actions.scrubWaveform };

export default connect(mapStateToProps, mapDispatchToProps)(EditorWaveform);
