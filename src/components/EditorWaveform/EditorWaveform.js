import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { useBoundingBox } from "$/hooks";
import { scrubWaveform } from "$/store/actions";
import { getCursorPosition, getDuration, getIsLoading } from "$/store/reducers/navigation.reducer";
import { getSelectedSong } from "$/store/reducers/songs.reducer";
import { getGraphicsLevel } from "$/store/reducers/user.reducer";
import { Quality } from "$/types";
import { roundToNearest } from "$/utils";

import Bookmarks from "../Bookmarks";
import CenteredSpinner from "../CenteredSpinner";
import ScrubbableWaveform from "../ScrubbableWaveform";

const EditorWaveform = ({ height, view, bookmarks }) => {
	const song = useSelector(getSelectedSong);
	const waveformData = useSelector((state) => state.waveform.data);
	const isLoadingSong = useSelector(getIsLoading);
	const duration = useSelector(getDuration);
	const cursorPosition = useSelector(getCursorPosition);
	const graphicsLevel = useSelector(getGraphicsLevel);
	const dispatch = useDispatch();
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
					<ScrubbableWaveform key={`${song.id}-${song.selectedDifficulty}`} view={view} width={boundingBox.width} height={height - UNIT * 2} waveformData={waveformData} duration={duration} cursorPosition={roundedCursorPosition} scrubWaveform={(offset) => dispatch(scrubWaveform({ newOffset: offset }))} />
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

export default EditorWaveform;
