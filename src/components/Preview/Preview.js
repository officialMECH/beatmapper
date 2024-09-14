import { connect } from "react-redux";
import styled from "styled-components";

import * as actions from "$/store/actions";
import { View } from "$/types";

import EditorBottomPanel from "../EditorBottomPanel";
import GlobalShortcuts from "../GlobalShortcuts";
import ReduxForwardingCanvas from "../ReduxForwardingCanvas";
// import KeyboardShortcuts from './KeyboardShortcuts';
import LightingPreview from "./LightingPreview";

const Preview = ({ isPlaying, scrollThroughSong }) => {
	return (
		<Wrapper>
			<ReduxForwardingCanvas>
				<LightingPreview />
			</ReduxForwardingCanvas>

			<EditorBottomPanel />

			<GlobalShortcuts view={View.PREVIEW} />
		</Wrapper>
	);
};

const Wrapper = styled.div`
  background: #000;
  width: 100%;
  height: 100%;
`;

const mapStateToProps = (state) => ({
	isPlaying: state.navigation.isPlaying,
});

const mapDispatchToProps = {
	scrollThroughSong: actions.scrollThroughSong,
};

export default connect(mapStateToProps, mapDispatchToProps)(Preview);
