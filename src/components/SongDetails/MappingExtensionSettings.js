import get from "lodash.get";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { toggleModForSong } from "$/store/actions";
import { getSelectedSong } from "$/store/reducers/songs.reducer";

import LabeledCheckbox from "../LabeledCheckbox";
import Link from "../Link";
import QuestionTooltip from "../QuestionTooltip";

const MappingExtensionSettings = () => {
	const song = useSelector(getSelectedSong);
	const dispatch = useDispatch();

	const isModEnabled = get(song, "modSettings.mappingExtensions.isEnabled") || false;

	return (
		<Wrapper>
			<LabeledCheckbox id="enable-mapping-extensions" checked={isModEnabled} onChange={() => dispatch(toggleModForSong({ mod: "mappingExtensions" }))}>
				Enable Mapping Extensions{" "}
				<QuestionTooltip>
					Allows you to customize size and shape of the grid, to place notes outside of the typical 4×3 grid.{" "}
					<Link forceAnchor to="/docs/mods#mapping-extensions">
						Learn more
					</Link>
					.
				</QuestionTooltip>
			</LabeledCheckbox>
		</Wrapper>
	);
};

const Wrapper = styled.div`
  user-select: none;
`;

export default MappingExtensionSettings;
