import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { useOnChange, useOnKeydown } from "$/hooks";
import { getSelectedBlocks, getSelectedMines, getSelectedObstacles } from "$/store/reducers/editor-entities.reducer/notes-view.reducer";
import { getMappingMode, getSelectedSong } from "$/store/reducers/songs.reducer";
import { ObjectPlacementMode } from "$/types";

import ItemGrid from "../ItemGrid";
import NoteGrid from "../NoteGrid";
import Spacer from "../Spacer";
import Actions from "./Actions";
import GridConfig from "./GridConfig";
import SelectionInfo from "./SelectionInfo";

// HACK: This should be a constant somewhere, used to set bottom panel
// height!
const bottomPanelHeight = 180;

const EditorRightPanel = () => {
	const song = useSelector(getSelectedSong);
	const mappingMode = useSelector(getMappingMode);
	const selectedBlocks = useSelector(getSelectedBlocks);
	const selectedMines = useSelector(getSelectedMines);
	const selectedObstacles = useSelector(getSelectedObstacles);

	const isAnythingSelected = selectedBlocks.length > 0 || selectedObstacles.length > 0 || selectedMines.length > 0;

	// This panel adapts based on the current situation.
	let panelContents;

	const [showGridConfig, setShowGridConfig] = React.useState(false);

	useOnChange(
		() => {
			if (showGridConfig && isAnythingSelected) {
				// If the user selects something while the grid panel is open,
				// switch to the selection panel
				setShowGridConfig(false);
			}
		},
		selectedBlocks.length + selectedMines.length + selectedObstacles.length,
	);

	useOnKeydown(
		"KeyG",
		() => {
			if (mappingMode === ObjectPlacementMode.EXTENSIONS) {
				setShowGridConfig((currentVal) => !currentVal);
			}
		},
		[mappingMode],
	);

	if (showGridConfig) {
		panelContents = <GridConfig finishTweakingGrid={() => setShowGridConfig(false)} />;
	} else if (isAnythingSelected) {
		panelContents = <SelectionInfo numOfSelectedBlocks={selectedBlocks.length} numOfSelectedMines={selectedMines.length} numOfSelectedObstacles={selectedObstacles.length} />;
	} else {
		panelContents = (
			<>
				<NoteGrid />
				<Spacer size={UNIT * 4} />
				<ItemGrid />
				<Spacer size={UNIT * 4} />
				<Actions song={song} handleGridConfigClick={() => setShowGridConfig(true)} />
			</>
		);
	}

	return (
		<OuterWrapper
			onWheel={(ev) => {
				// On smaller windows, the content won't fit in the side panel.
				// By default we disable all mousewheel action since it causes problems
				// with our main view, but if the cursor is over this panel, we'll
				// allow it to behave normally by not bubbling that event to the
				// window handler (which prevents it).
				ev.stopPropagation();
			}}
		>
			<Wrapper>{panelContents}</Wrapper>
		</OuterWrapper>
	);
};

const OuterWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: ${bottomPanelHeight}px;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
`;

const Wrapper = styled.div`
  color: #fff;
  padding: ${UNIT * 4}px ${UNIT * 3}px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: ${UNIT}px 0 0 ${UNIT}px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  user-select: none;
  overflow: auto;
  pointer-events: auto;
`;

export default EditorRightPanel;
