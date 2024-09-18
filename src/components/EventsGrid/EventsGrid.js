import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { COLORS, EVENT_TRACKS, UNIT } from "$/constants";
import { useMousePositionOverElement, usePointerUpHandler } from "$/hooks";
import { clearSelectionBox, commitSelection, drawSelectionBox, moveMouseAcrossEventsGrid } from "$/store/actions";
import { getAreLasersLocked, getRowHeight, getSelectedEventBeat, getSelectedEventEditMode, getSelectionBox, getStartAndEndBeat } from "$/store/reducers/editor.reducer";
import { getIsLoading, getSnapTo } from "$/store/reducers/navigation.reducer";
import { App, EventEditMode, TrackType } from "$/types";
import { normalize, range, roundToNearest } from "$/utils";

import BackgroundLines from "./BackgroundLines";
import BlockTrack from "./BlockTrack";
import CursorPositionIndicator from "./CursorPositionIndicator";
import GridHeader from "./GridHeader";
import SelectionBox from "./SelectionBox";
import SpeedTrack from "./SpeedTrack";

const LAYERS = {
	background: 0,
	mouseCursor: 1,
	tracks: 2,
	songPositionIndicator: 3,
};

const PREFIX_WIDTH = 170;

const convertMousePositionToBeatNum = (x, innerGridWidth, beatNums, startBeat, snapTo) => {
	const positionInBeats = normalize(x, 0, innerGridWidth, 0, beatNums.length);

	let roundedPositionInBeats = positionInBeats;
	if (typeof snapTo === "number") {
		roundedPositionInBeats = roundToNearest(positionInBeats, snapTo);
	}

	return roundedPositionInBeats + startBeat;
};

const EventsGrid = ({ contentWidth }) => {
	const { startBeat, endBeat } = useSelector(getStartAndEndBeat);
	const numOfBeatsToShow = endBeat - startBeat;
	const selectedEditMode = useSelector(getSelectedEventEditMode);
	const selectedBeat = useSelector(getSelectedEventBeat);
	const isLoading = useSelector(getIsLoading);
	const areLasersLocked = useSelector(getAreLasersLocked);
	const snapTo = useSelector(getSnapTo);
	const selectionBox = useSelector(getSelectionBox);
	const rowHeight = useSelector(getRowHeight);
	const dispatch = useDispatch();

	const innerGridWidth = contentWidth - PREFIX_WIDTH;

	const headerHeight = 32;
	const innerGridHeight = rowHeight * EVENT_TRACKS.length;

	const beatNums = range(Math.floor(startBeat), Math.ceil(endBeat));

	const [mouseDownAt, setMouseDownAt] = React.useState(null);
	const mouseButtonDepressed = React.useRef(null); // 'left' | 'middle' | 'right'

	const mousePositionRef = React.useRef(null);

	React.useEffect(() => {
		setMouseDownAt(null);
		mousePositionRef.current = null;
		dispatch(clearSelectionBox());
	}, [dispatch]);

	const handleCompleteSelection = React.useCallback(() => {
		mouseButtonDepressed.current = null;
		setMouseDownAt(null);

		dispatch(commitSelection());
	}, [dispatch]);

	const shouldCompleteSelectionOnPointerUp = selectedEditMode === EventEditMode.SELECT && !!mouseDownAt;

	usePointerUpHandler(shouldCompleteSelectionOnPointerUp, handleCompleteSelection);

	const tracksRef = useMousePositionOverElement((x, y) => {
		const currentMousePosition = { x, y };
		mousePositionRef.current = currentMousePosition;

		const hoveringOverBeatNum = convertMousePositionToBeatNum(x, innerGridWidth, beatNums, startBeat, snapTo);

		if (selectedEditMode === EventEditMode.SELECT && mouseDownAt && mouseButtonDepressed.current === "left") {
			const newSelectionBox = {
				top: Math.min(mouseDownAt.y, currentMousePosition.y),
				left: Math.min(mouseDownAt.x, currentMousePosition.x),
				right: Math.max(mouseDownAt.x, currentMousePosition.x),
				bottom: Math.max(mouseDownAt.y, currentMousePosition.y),
			};

			// Selection boxes need to include their cartesian values, in pixels, but
			// we should also encode the values in business terms: start/end beat,
			// and start/end track
			const startTrackIndex = Math.floor(newSelectionBox.top / rowHeight);
			const endTrackIndex = Math.floor(newSelectionBox.bottom / rowHeight);

			const start = convertMousePositionToBeatNum(newSelectionBox.left, innerGridWidth, beatNums, startBeat);

			const end = convertMousePositionToBeatNum(newSelectionBox.right, innerGridWidth, beatNums, startBeat);

			const newSelectionBoxInBeats = {
				startTrackIndex,
				endTrackIndex,
				startBeat: start,
				endBeat: end,
			};

			dispatch(drawSelectionBox({ selectionBox: newSelectionBox, selectionBoxInBeats: newSelectionBoxInBeats }));
		}

		if (hoveringOverBeatNum !== selectedBeat) dispatch(moveMouseAcrossEventsGrid({ selectedBeat: hoveringOverBeatNum }));
	});

	const mousePositionInPx = normalize(selectedBeat - startBeat, 0, beatNums.length, 0, innerGridWidth);

	const handlePointerDown = (ev) => {
		if (ev.button === 0) {
			mouseButtonDepressed.current = "left";
		} else if (ev.button === 2) {
			mouseButtonDepressed.current = "right";
		} else {
			// TODO: Middle button support?
			mouseButtonDepressed.current = "left";
		}

		setMouseDownAt(mousePositionRef.current);
	};

	const getIsTrackDisabled = (trackId) => {
		if (!areLasersLocked) {
			return false;
		}

		return trackId === App.TrackId[3] || trackId === App.TrackId[13];
	};

	return (
		<Wrapper isLoading={isLoading} style={{ width: contentWidth }}>
			<PrefixColumn
				style={{ width: PREFIX_WIDTH }}
				onContextMenu={(ev) => {
					// I often accidentally right-click the prefix when trying to
					// delete notes near the start of the window. Avoid this problem.
					ev.preventDefault();
				}}
			>
				<TopLeftBlankCell style={{ height: headerHeight }} />

				{EVENT_TRACKS.map(({ id, type, label }) => (
					<TrackPrefix key={id} style={{ height: rowHeight }} isDisabled={getIsTrackDisabled(id)}>
						{label}
					</TrackPrefix>
				))}
			</PrefixColumn>

			<Grid>
				<GridHeader height={headerHeight} beatNums={beatNums} selectedBeat={selectedBeat} />

				<MainGridContent
					style={{
						height: innerGridHeight,
						cursor: selectedEditMode === EventEditMode.SELECT ? "crosshair" : "pointer",
					}}
				>
					<BackgroundLinesWrapper>
						<BackgroundLines width={innerGridWidth} height={innerGridHeight} numOfBeatsToShow={numOfBeatsToShow} primaryDivisions={4} secondaryDivisions={0} />
					</BackgroundLinesWrapper>

					<Tracks ref={tracksRef} onPointerDown={handlePointerDown}>
						{EVENT_TRACKS.map(({ id, type }) => {
							const TrackComponent = type === TrackType.LIGHT || type === TrackType.TRIGGER ? BlockTrack : SpeedTrack;

							const isDisabled = getIsTrackDisabled(id);

							return <TrackComponent key={id} trackId={id} width={innerGridWidth} height={rowHeight} startBeat={startBeat} numOfBeatsToShow={numOfBeatsToShow} cursorAtBeat={selectedBeat} isDisabled={isDisabled} areLasersLocked={areLasersLocked} />;
						})}
					</Tracks>

					{selectionBox && <SelectionBox box={selectionBox} />}

					<CursorPositionIndicator gridWidth={innerGridWidth} startBeat={startBeat} endBeat={endBeat} zIndex={LAYERS.songPositionIndicator} />

					{typeof mousePositionInPx === "number" && <MouseCursor style={{ left: mousePositionInPx }} />}
				</MainGridContent>
			</Grid>
		</Wrapper>
	);
};

const Wrapper = styled.div`
  display: flex;
  opacity: ${(props) => (props.isLoading ? 0.25 : 1)};
  /*
    Disallow clicking until the song has loaded, to prevent weird edge-case bugs
  */
  pointer-events: ${(props) => (props.isLoading ? "none" : "auto")};
  /* Don't allow the track labels or beat nums to be selected */
  user-select: none;
`;

const PrefixColumn = styled.div`
  width: 170px;
  border-right: 2px solid rgba(255, 255, 255, 0.25);
`;

const Grid = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TopLeftBlankCell = styled.div`
  border-bottom: 1px solid ${COLORS.blueGray[500]};
`;

const MainGridContent = styled.div`
  flex: 1;
  position: relative;
`;

const BackgroundLinesWrapper = styled.div`
  position: absolute;
  z-index: ${LAYERS.background};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const TrackPrefix = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  font-size: 15px;
  font-weight: 400;
  color: ${COLORS.blueGray[100]};
  padding: 0 ${UNIT}px;
  border-bottom: 1px solid ${COLORS.blueGray[400]};

  opacity: ${(p) => p.isDisabled && 0.5};
  cursor: ${(p) => p.isDisabled && "not-allowed"};
  background-color: ${(p) => p.isDisabled && "rgba(255,255,255,0.2)"};

  &:last-of-type {
    border-bottom: none;
  }
`;

const Tracks = styled.div`
  position: relative;
  z-index: ${LAYERS.tracks};
`;

const MouseCursor = styled.div`
  position: absolute;
  top: 0;
  z-index: ${LAYERS.mouseCursor};
  width: 3px;
  height: 100%;
  background: ${COLORS.blueGray[100]};
  border: 1px solid ${COLORS.blueGray[900]};
  border-radius: 2px;
  pointer-events: none;
  transform: translateX(-1px);
`;

export default EventsGrid;
