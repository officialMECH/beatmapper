import { arrowDown } from "react-icons-kit/feather/arrowDown";
import { arrowDownLeft } from "react-icons-kit/feather/arrowDownLeft";
import { arrowDownRight } from "react-icons-kit/feather/arrowDownRight";
import { arrowLeft } from "react-icons-kit/feather/arrowLeft";
import { arrowRight } from "react-icons-kit/feather/arrowRight";
import { arrowUp } from "react-icons-kit/feather/arrowUp";
import { arrowUpLeft } from "react-icons-kit/feather/arrowUpLeft";
import { arrowUpRight } from "react-icons-kit/feather/arrowUpRight";
import { circle } from "react-icons-kit/feather/circle";
import { connect } from "react-redux";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { Direction, ObjectTool } from "$/types";
import * as actions from "../../actions";
import { getSelectedCutDirection, getSelectedNoteTool } from "../../reducers/editor.reducer";

import Heading from "../Heading";
import IconButton from "../IconButton";
import Spacer from "../Spacer";

const NoteGrid = ({ selectedDirection, selectedNoteTool, selectNoteDirection }) => {
	const isDisabled = selectedNoteTool !== ObjectTool.LEFT_NOTE && selectedNoteTool !== ObjectTool.RIGHT_NOTE;

	return (
		<Wrapper>
			<Heading size={3}>Notes</Heading>

			<Spacer size={UNIT * 1.5} />

			<Grid>
				<Row>
					<IconButton disabled={isDisabled} icon={arrowUpLeft} isToggled={selectedDirection === Direction.UP_LEFT} onClick={() => selectNoteDirection(Direction.UP_LEFT)} />
					<Spacer size={1} />
					<IconButton disabled={isDisabled} icon={arrowUp} isToggled={selectedDirection === Direction.UP} onClick={() => selectNoteDirection(Direction.UP)} />
					<Spacer size={1} />
					<IconButton disabled={isDisabled} icon={arrowUpRight} isToggled={selectedDirection === Direction.UP_RIGHT} onClick={() => selectNoteDirection(Direction.UP_RIGHT)} />
				</Row>
				<Spacer size={1} />
				<Row>
					<IconButton disabled={isDisabled} icon={arrowLeft} isToggled={selectedDirection === Direction.LEFT} onClick={() => selectNoteDirection(Direction.LEFT)} />
					<Spacer size={1} />
					<IconButton disabled={isDisabled} icon={circle} isToggled={selectedDirection === Direction.ANY} onClick={() => selectNoteDirection(Direction.ANY)} />
					<Spacer size={1} />
					<IconButton disabled={isDisabled} icon={arrowRight} isToggled={selectedDirection === Direction.RIGHT} onClick={() => selectNoteDirection(Direction.RIGHT)} />
					<Spacer size={1} />
				</Row>
				<Spacer size={1} />
				<Row>
					<IconButton disabled={isDisabled} icon={arrowDownLeft} isToggled={selectedDirection === Direction.DOWN_LEFT} onClick={() => selectNoteDirection(Direction.DOWN_LEFT)} />
					<Spacer size={1} />
					<IconButton disabled={isDisabled} icon={arrowDown} isToggled={selectedDirection === Direction.DOWN} onClick={() => selectNoteDirection(Direction.DOWN)} />
					<Spacer size={1} />
					<IconButton disabled={isDisabled} icon={arrowDownRight} isToggled={selectedDirection === Direction.DOWN_RIGHT} onClick={() => selectNoteDirection(Direction.DOWN_RIGHT)} />
					<Spacer size={1} />
				</Row>
			</Grid>
		</Wrapper>
	);
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Grid = styled.div``;

const Row = styled.div`
  display: flex;
`;

const mapStateToProps = (state) => ({
	selectedNoteTool: getSelectedNoteTool(state),
	selectedDirection: getSelectedCutDirection(state),
});

const mapDispatchToProps = { selectNoteDirection: actions.selectNoteDirection };

export default connect(mapStateToProps, mapDispatchToProps)(NoteGrid);
