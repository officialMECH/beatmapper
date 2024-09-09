import { connect } from "react-redux";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { ObjectTool, View } from "$/types";
import * as actions from "../../actions";
import { getColorForItem } from "../../helpers/colors.helpers";
import { getSelectedSong } from "../../reducers/songs.reducer";

import Heading from "../Heading";
import IconButton from "../IconButton";
import Spacer from "../Spacer";
import BlockIcon from "./BlockIcon";
import MineIcon from "./MineIcon";
import ObstacleIcon from "./ObstacleIcon";

const ItemGrid = ({ song, selectedTool, selectTool }) => {
	const buttonSize = 36;
	return (
		<Wrapper>
			<Heading size={3}>Items</Heading>

			<Spacer size={UNIT * 1.5} />

			<Grid>
				<Row>
					<IconButton size={buttonSize} isToggled={selectedTool === ObjectTool.LEFT_NOTE} onClick={() => selectTool(View.BEATMAP, ObjectTool.LEFT_NOTE)}>
						<BlockIcon color={getColorForItem(ObjectTool.LEFT_NOTE, song)} />
					</IconButton>
					<Spacer size={1} />
					<IconButton size={buttonSize} isToggled={selectedTool === ObjectTool.RIGHT_NOTE} onClick={() => selectTool(View.BEATMAP, ObjectTool.RIGHT_NOTE)}>
						<BlockIcon color={getColorForItem(ObjectTool.RIGHT_NOTE, song)} />
					</IconButton>
					<Spacer size={1} />
					<IconButton size={buttonSize} isToggled={selectedTool === ObjectTool.BOMB_NOTE} onClick={() => selectTool(View.BEATMAP, ObjectTool.BOMB_NOTE)}>
						<MineIcon size={20} />
					</IconButton>
					<Spacer size={1} />
					<IconButton size={buttonSize} isToggled={selectedTool === ObjectTool.OBSTACLE} onClick={() => selectTool(View.BEATMAP, ObjectTool.OBSTACLE)}>
						<ObstacleIcon size={20} />
					</IconButton>
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
	song: getSelectedSong(state),
	selectedTool: state.editor.notes.selectedTool,
});

const mapDispatchToProps = { selectTool: actions.selectTool };

export default connect(mapStateToProps, mapDispatchToProps)(ItemGrid);
