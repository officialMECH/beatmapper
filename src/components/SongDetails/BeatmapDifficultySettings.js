import React from "react";
import { connect } from "react-redux";
import { useBlocker, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { COLORS, UNIT } from "$/constants";
import { renderImperativePrompt } from "$/helpers/modal.helpers";
import { getLabelForDifficulty } from "$/helpers/song.helpers";
import * as actions from "$/store/actions";

import CopyDifficultyForm from "../CopyDifficultyForm";
import Heading from "../Heading";
import MiniButton from "../MiniButton";
import Spacer from "../Spacer";
import TextInput from "../TextInput";

const BeatmapSettings = ({ song, difficultyId, updateBeatmapMetadata, copyDifficulty, deleteBeatmap, history }) => {
	const navigate = useNavigate();

	const savedVersion = song.difficultiesById[difficultyId];

	const [noteJumpSpeed, setNoteJumpSpeed] = React.useState(savedVersion.noteJumpSpeed);
	const [startBeatOffset, setStartBeatOffset] = React.useState(savedVersion.startBeatOffset);

	const [customLabel, setCustomLabel] = React.useState(savedVersion.customLabel);

	const isDirty = Number(noteJumpSpeed) !== savedVersion.noteJumpSpeed || Number(startBeatOffset) !== savedVersion.startBeatOffset || customLabel !== savedVersion.customLabel;

	const handleCopyBeatmap = (ev) => {
		ev.preventDefault();

		const modalProps = { width: 400, alignment: "top" };

		renderImperativePrompt(modalProps, (triggerSuccess) => <CopyDifficultyForm song={song} idToCopy={difficultyId} afterCopy={triggerSuccess} copyDifficulty={copyDifficulty} />).then((copiedToDifficultyId) => {
			// Redirect the user to this new difficulty, so that when they go to
			// edit it, they're editing the right difficulty.
			navigate(`/edit/${song.id}/${copiedToDifficultyId}/details`);
		});
	};

	const handleDeleteBeatmap = (ev) => {
		ev.preventDefault();

		const confirmed = window.confirm("Are you sure you want to do this? This action cannot be undone.");

		if (!confirmed) {
			return;
		}

		// Delete our working state
		const mutableDifficultiesCopy = { ...song.difficultiesById };
		delete mutableDifficultiesCopy[difficultyId];

		// Don't let the user delete the last difficulty!
		const remainingDifficultyIds = Object.keys(mutableDifficultiesCopy);
		if (remainingDifficultyIds.length === 0) {
			alert("Sorry, you cannot delete the only remaining difficulty! Please create another difficulty first.");
			return;
		}

		// If the user is currently editing the difficulty that they're trying to
		// delete, let's redirect them to the next difficulty.
		const nextDifficultyId = remainingDifficultyIds[0];

		deleteBeatmap(song.id, difficultyId);

		navigate(`/edit/${song.id}/${nextDifficultyId}/details`);
	};

	const handleSaveBeatmap = (ev) => {
		// Validate that both values are valid numbers.
		if (Number.isNaN(noteJumpSpeed)) {
			window.alert("Note jump speed needs to be a number");
		} else if (Number.isNaN(startBeatOffset)) {
			window.alert("Start beat offset needs to be a number");
		}

		updateBeatmapMetadata(song.id, difficultyId, Number(noteJumpSpeed), Number(startBeatOffset), customLabel);
	};

	const difficultyLabel = getLabelForDifficulty(difficultyId);

	useBlocker(() => (isDirty ? !window.confirm(`You have unsaved changes! Are you sure you want to leave this page?\n\n(You tweaked a value for the ${difficultyLabel} beatmap)`) : false));

	return (
		<Wrapper>
			<Heading size={3}>{difficultyLabel}</Heading>
			<Spacer size={UNIT * 3} />
			<TextInput label="Note jump speed" value={noteJumpSpeed} onChange={(ev) => setNoteJumpSpeed(ev.target.value)} />
			<Spacer size={UNIT * 3} />
			<TextInput label="Start beat offset" value={startBeatOffset} onChange={(ev) => setStartBeatOffset(ev.target.value)} />
			<Spacer size={UNIT * 3} />
			<TextInput label="Custom label" value={customLabel || ""} onChange={(ev) => setCustomLabel(ev.target.value)} />
			<Spacer size={UNIT * 3} />

			<Row>
				<MiniButton disabled={!isDirty} onClick={handleSaveBeatmap}>
					Save
				</MiniButton>
				<Spacer size={UNIT * 2} />
				<MiniButton onClick={handleCopyBeatmap}>Copy</MiniButton>
				<Spacer size={UNIT * 2} />
				<MiniButton color={COLORS.red[700]} hoverColor={COLORS.red[500]} onClick={handleDeleteBeatmap}>
					Delete
				</MiniButton>
			</Row>
		</Wrapper>
	);
};

const Wrapper = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: ${UNIT * 3}px;
  margin: ${UNIT * 2}px;

  &:last-of-type {
    margin-right: 0;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
`;

const mapDispatchToProps = {
	updateBeatmapMetadata: actions.updateBeatmapMetadata,
	copyDifficulty: actions.copyDifficulty,
	deleteBeatmap: actions.deleteBeatmap,
};

export default connect(null, mapDispatchToProps)(BeatmapSettings);
