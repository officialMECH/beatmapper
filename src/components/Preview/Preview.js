import { connect } from "react-redux";
import styled from "styled-components";

import { PREVIEW_VIEW } from "$/constants";
import * as actions from "../../actions";

import EditorBottomPanel from "../EditorBottomPanel";
import ReduxForwardingCanvas from "../ReduxForwardingCanvas";

import GlobalShortcuts from "../GlobalShortcuts";
// import KeyboardShortcuts from './KeyboardShortcuts';
import LightingPreview from "./LightingPreview";

const Preview = ({ isPlaying, scrollThroughSong }) => {
	return (
		<Wrapper>
			<ReduxForwardingCanvas>
				<LightingPreview />
			</ReduxForwardingCanvas>

			<EditorBottomPanel />

			<GlobalShortcuts view={PREVIEW_VIEW} />
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
