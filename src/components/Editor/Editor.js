import React from "react";
import { connect, useSelector } from "react-redux";
import { Route, Routes, useParams } from "react-router-dom";
import styled from "styled-components";

import { COLORS, SIDEBAR_WIDTH } from "$/constants";
import * as actions from "../../actions";
import { getSelectedSong } from "../../reducers/songs.reducer";

import Download from "../Download";
import EditorPrompts from "../EditorPrompts";
import Events from "../Events";
import LoadingScreen from "../LoadingScreen";
import NotesEditor from "../NotesEditor";
import Preview from "../Preview";
import Sidebar from "../Sidebar";
import SongDetails from "../SongDetails";

import EditorErrors from "./EditorErrors";

const Editor = ({ startLoadingSong, leaveEditor }) => {
	const { songId, difficulty } = useParams();

	const selectedSongFromRedux = useSelector((state) => getSelectedSong(state));

	const isCorrectSongSelected = selectedSongFromRedux && songId === selectedSongFromRedux.id;

	// HACK: We're duplicating the state between the URL (/edit/:songId) and Redux
	// (state.songs.selectedId). This is because having the URL as the sole
	// source of truth was a HUGE pain in the butt. This way is overall much
	// nicer, but it has this one big issue: syncing the state initially.
	//
	// Our locally-persisted state might be out of date. We need to fix that
	// before we do anything else.
	React.useEffect(() => {
		startLoadingSong(songId, difficulty);
	}, [startLoadingSong, songId, difficulty]);

	React.useEffect(() => {
		return () => {
			leaveEditor();
		};
	}, [leaveEditor]);

	if (!isCorrectSongSelected) {
		return <LoadingScreen />;
	}

	return (
		<>
			<Sidebar />

			<Wrapper>
				<EditorErrors>
					<Routes>
						<Route path="/notes" element={<NotesEditor />} />
						<Route path="/events" element={<Events />} />
						<Route path="/preview" element={<Preview />} />
						<Route path="/details" element={<SongDetails />} />
						<Route path="/download" element={<Download />} />
					</Routes>
				</EditorErrors>
			</Wrapper>

			<EditorPrompts />
		</>
	);
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${SIDEBAR_WIDTH}px;
  right: 0;
  bottom: 0;
  background: ${COLORS.blueGray[1000]};
`;

const mapDispatchToProps = {
	startLoadingSong: actions.startLoadingSong,
	leaveEditor: actions.leaveEditor,
};

export default connect(null, mapDispatchToProps)(Editor);
