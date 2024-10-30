import { Tooltip } from "react-tippy";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { redoNotes, undoNotes } from "$/store/actions";
import { useAppDispatch, useAppSelector } from "$/store/hooks";
import { getCanRedo, getCanUndo } from "$/store/selectors";
import { getMetaKeyLabel } from "$/utils";
import { HALF_ACTION_WIDTH } from "./EditorRightPanel.constants";

import MiniButton from "../MiniButton";
import Spacer from "../Spacer";

const UndoRedo = () => {
	const canUndo = useAppSelector(getCanUndo);
	const canRedo = useAppSelector(getCanRedo);
	const dispatch = useAppDispatch();

	return (
		<Row>
			<Tooltip delay={1000} title={`(${getMetaKeyLabel()} + Z)`}>
				<MiniButton width={HALF_ACTION_WIDTH} disabled={!canUndo} onClick={() => dispatch(undoNotes())}>
					Undo
				</MiniButton>
			</Tooltip>
			<Spacer size={UNIT} />
			<Tooltip delay={1000} title={`(Shift + ${getMetaKeyLabel()} + Z)`}>
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
