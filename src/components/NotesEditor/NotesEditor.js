import React from "react";
import styled from "styled-components";

import EditorBottomPanel from "../EditorBottomPanel";
import EditorRightPanel from "../EditorRightPanel";
import GlobalShortcuts from "../GlobalShortcuts";
import MapVisualization from "../MapVisualization";
import ReduxForwardingCanvas from "../ReduxForwardingCanvas";
import SongInfo from "../SongInfo";

import { NOTES_VIEW } from "../../constants";
import KeyboardShortcuts from "./KeyboardShortcuts";

const NotesEditor = () => {
	return (
		<Wrapper>
			<SongInfo showDifficultySelector />

			<ReduxForwardingCanvas>
				<MapVisualization />
			</ReduxForwardingCanvas>

			<EditorBottomPanel />
			<EditorRightPanel />

			<GlobalShortcuts view={NOTES_VIEW} />
			<KeyboardShortcuts />
		</Wrapper>
	);
};

const Wrapper = styled.div`
  background: #000;
  width: 100%;
  height: 100%;
`;

export default NotesEditor;
