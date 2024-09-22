import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-tippy";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { promptJumpToBeat, promptQuickSelect } from "$/helpers/prompts.helpers";
import { jumpToBeat, pasteSelection, selectAllInRange } from "$/store/actions";
import { getHasCopiedNotes } from "$/store/selectors";
import { View } from "$/types";
import { getMetaKeyLabel } from "$/utils";
import { ACTION_WIDTH } from "./EditorRightPanel.constants";

import Heading from "../Heading";
import MiniButton from "../MiniButton";
import Spacer from "../Spacer";
import UndoRedo from "./UndoRedo";

const Actions = ({ song, handleGridConfigClick, canUndo, canRedo }) => {
	const hasCopiedNotes = useSelector(getHasCopiedNotes);
	const dispatch = useDispatch();
	const mappingExtensionsEnabled = song?.modSettings?.mappingExtensions?.isEnabled;

	return (
		<Wrapper>
			<Heading size={3}>Actions</Heading>
			<Spacer size={UNIT * 1.5} />

			<UndoRedo />

			<Spacer size={UNIT} />

			<Tooltip delay={[1000, 0]} title={`Paste previously-copied notes (${getMetaKeyLabel()} + V)`}>
				<MiniButton disabled={!hasCopiedNotes} width={ACTION_WIDTH} onClick={() => dispatch(pasteSelection({ view: View.BEATMAP }))}>
					Paste Selection
				</MiniButton>
			</Tooltip>

			<Spacer size={UNIT} />

			<Tooltip delay={[1000, 0]} title="Select everything over a time period (Q)">
				<MiniButton width={ACTION_WIDTH} onClick={() => dispatch(promptQuickSelect(View.BEATMAP, selectAllInRange))}>
					Quick-select
				</MiniButton>
			</Tooltip>

			<Spacer size={UNIT} />

			<Tooltip delay={[1000, 0]} title="Jump to a specific beat number (J)">
				<MiniButton width={ACTION_WIDTH} onClick={() => dispatch(promptJumpToBeat(jumpToBeat, { pauseTrack: true }))}>
					Jump to Beat
				</MiniButton>
			</Tooltip>

			{mappingExtensionsEnabled && (
				<>
					<Spacer size={UNIT} />

					<Tooltip delay={[500, 0]} title="Change the number of columns/rows">
						<MiniButton onClick={handleGridConfigClick}>Customize Grid</MiniButton>
					</Tooltip>
				</>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Actions;
