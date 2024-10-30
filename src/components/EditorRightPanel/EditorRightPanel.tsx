import { Fragment, type ReactNode, useState } from "react";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { useOnChange, useOnKeydown } from "$/hooks";
import { useAppSelector } from "$/store/hooks";
import { getMappingMode, getSelectedBlocks, getSelectedMines, getSelectedObstacles, getSelectedSong } from "$/store/selectors";
import { ObjectPlacementMode } from "$/types";

import ItemGrid from "../ItemGrid";
import NoteGrid from "../NoteGrid";
import Spacer from "../Spacer";
import Actions from "./Actions";
import GridConfig from "./GridConfig";
import SelectionInfo from "./SelectionInfo";

// TODO: This should be a constant somewhere, used to set bottom panel height!
const bottomPanelHeight = 180;

const EditorRightPanel = () => {
	const song = useAppSelector(getSelectedSong);
	const mappingMode = useAppSelector(getMappingMode);
	const selectedBlocks = useAppSelector(getSelectedBlocks);
	const selectedMines = useAppSelector(getSelectedMines);
	const selectedObstacles = useAppSelector(getSelectedObstacles);

	const isAnythingSelected = selectedBlocks.length > 0 || selectedObstacles.length > 0 || selectedMines.length > 0;

	// This panel adapts based on the current situation.
	let panelContents: ReactNode;

	const [showGridConfig, setShowGridConfig] = useState(false);

	useOnChange(
		() => {
			if (showGridConfig && isAnythingSelected) {
				// If the user selects something while the grid panel is open, switch to the selection panel
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
			<Fragment>
				<NoteGrid />
				<Spacer size={UNIT * 4} />
				<ItemGrid />
				<Spacer size={UNIT * 4} />
				<Actions song={song} handleGridConfigClick={() => setShowGridConfig(true)} />
			</Fragment>
		);
	}

	return (
		<OuterWrapper
			onWheel={(ev) => {
				// On smaller windows, the content won't fit in the side panel.
				// By default we disable all mousewheel action since it causes problems with our main view,
				// but if the cursor is over this panel, we'll allow it to behave normally by not bubbling that event to the window handler (which prevents it).
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
