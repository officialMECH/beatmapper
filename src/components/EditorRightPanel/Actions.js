import { connect } from "react-redux";
import { Tooltip } from "react-tippy";
import styled from "styled-components";

import { NOTES_VIEW, UNIT } from "$/constants";
import * as actions from "../../actions";
import { promptJumpToBeat, promptQuickSelect } from "../../helpers/prompts.helpers";
import { getMetaKeyLabel } from "../../utils";

import { getHasCopiedNotes } from "../../reducers/clipboard.reducer";
import Heading from "../Heading";
import MiniButton from "../MiniButton";
import Spacer from "../Spacer";

import { ACTION_WIDTH } from "./EditorRightPanel.constants";
import UndoRedo from "./UndoRedo";

const Actions = ({
	song,
	handleGridConfigClick,

	canUndo,
	canRedo,
	hasCopiedNotes,
	selectAllInRange,
	jumpToBeat,
	undoNotes,
	redoNotes,
	pasteSelection,
}) => {
	const mappingExtensionsEnabled = song?.modSettings?.mappingExtensions?.isEnabled;

	return (
		<Wrapper>
			<Heading size={3}>Actions</Heading>
			<Spacer size={UNIT * 1.5} />

			<UndoRedo />

			<Spacer size={UNIT} />

			<Tooltip delay={[1000, 0]} title={`Paste previously-copied notes (${getMetaKeyLabel()} + V)`}>
				<MiniButton disabled={!hasCopiedNotes} width={ACTION_WIDTH} onClick={() => pasteSelection(NOTES_VIEW)}>
					Paste Selection
				</MiniButton>
			</Tooltip>

			<Spacer size={UNIT} />

			<Tooltip delay={[1000, 0]} title="Select everything over a time period (Q)">
				<MiniButton width={ACTION_WIDTH} onClick={() => promptQuickSelect(NOTES_VIEW, selectAllInRange)}>
					Quick-select
				</MiniButton>
			</Tooltip>

			<Spacer size={UNIT} />

			<Tooltip delay={[1000, 0]} title="Jump to a specific beat number (J)">
				<MiniButton width={ACTION_WIDTH} onClick={() => promptJumpToBeat(jumpToBeat, true)}>
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

const mapStateToProps = (state) => {
	return {
		hasCopiedNotes: getHasCopiedNotes(state),
	};
};

const mapDispatchToProps = {
	selectAllInRange: actions.selectAllInRange,
	jumpToBeat: actions.jumpToBeat,
	pasteSelection: actions.pasteSelection,
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
