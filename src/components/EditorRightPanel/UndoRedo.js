import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-tippy";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { getCanRedo, getCanUndo } from "$/store/reducers/editor-entities.reducer/notes-view.reducer";
import { getMetaKeyLabel } from "$/utils";

import MiniButton from "../MiniButton";
import Spacer from "../Spacer";

import { HALF_ACTION_WIDTH } from "./EditorRightPanel.constants";

const UndoRedo = ({ undoNotes, redoNotes }) => {
	const canUndo = useSelector(getCanUndo);
	const canRedo = useSelector(getCanRedo);
	const dispatch = useDispatch();

	return (
		<Row>
			<Tooltip delay={[1000, 0]} title={`(${getMetaKeyLabel()} + Z)`}>
				<MiniButton width={HALF_ACTION_WIDTH} disabled={!canUndo} onClick={() => dispatch(undoNotes())}>
					Undo
				</MiniButton>
			</Tooltip>
			<Spacer size={UNIT} />
			<Tooltip delay={[1000, 0]} title={`(Shift + ${getMetaKeyLabel()} + Z)`}>
				<MiniButton width={HALF_ACTION_WIDTH} disabled={!canRedo} onClick={() => dispatch(redoNotes())}>
					Redo
				</MiniButton>
			</Tooltip>
		</Row>
	);
};

const Row = styled.div`
  display: flex;
`;

export default UndoRedo;
