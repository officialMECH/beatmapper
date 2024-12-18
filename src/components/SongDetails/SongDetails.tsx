import { type FormEventHandler, useState } from "react";
import { useBlocker } from "react-router-dom";
import styled from "styled-components";

import { COLORS, ENVIRONMENT_DISPLAY_MAP, MEDIA_ROW_HEIGHT, UNIT } from "$/constants";
import { sortDifficultyIds } from "$/helpers/song.helpers";
import { useMount } from "$/hooks";
import { getFile, saveInfoDat, saveLocalCoverArtFile, saveSongFile } from "$/services/file.service";
import { createInfoContent } from "$/services/packaging.service";
import { stopPlaying, togglePropertyForSelectedSong, updateSongDetails } from "$/store/actions";
import { useAppDispatch, useAppSelector } from "$/store/hooks";
import { getEnabledFastWalls, getEnabledLightshow, getSelectedSong } from "$/store/selectors";
import type { App } from "$/types";

import CoverArtPicker from "../AddSongForm/CoverArtPicker";
import SongPicker from "../AddSongForm/SongPicker";
import Button from "../Button";
import DropdownInput from "../DropdownInput";
import Heading from "../Heading";
import LabeledCheckbox from "../LabeledCheckbox";
import Link from "../Link";
import QuestionTooltip from "../QuestionTooltip";
import Spacer from "../Spacer";
import Spinner from "../Spinner";
import TextInput from "../TextInput";
import BeatmapDifficultySettings from "./BeatmapDifficultySettings";
import CustomColorSettings from "./CustomColorSettings";
import MappingExtensionSettings from "./MappingExtensionSettings";

const SongDetails = () => {
	const dispatch = useAppDispatch();
	const song = useAppSelector(getSelectedSong);
	const enabledFastWalls = useAppSelector(getEnabledFastWalls);
	const enabledLightshow = useAppSelector(getEnabledLightshow);

	const [songData, setSongData] = useState(song);
	const [isDirty, setIsDirty] = useState(false);
	const [songFile, setSongFile] = useState<File | null>(null);
	const [coverArtFile, setCoverArtFile] = useState<File | null>(null);

	function setSongProperty<Key extends keyof App.Song | "songFile" | "coverArtFile">(key: Key, value: Key extends keyof App.Song ? App.Song[Key] : File | null) {
		if (key === "songFile") {
			setSongFile(value as File);
		} else if (key === "coverArtFile") {
			setCoverArtFile(value as File);
		} else {
			setSongData({ ...songData, [key]: value });
		}

		setIsDirty(true);
	}

	const [status, setStatus] = useState("idle");

	const difficultyIds = sortDifficultyIds(Object.keys(song.difficultiesById));

	useMount(() => {
		// We want to stop & reset the song when the user goes to edit it.
		// In addition to seeming like a reasonable idea, it helps prevent any weirdness around editing the audio file when it's in a non-zero position.
		dispatch(stopPlaying({ offset: song.offset }));

		if (song.songFilename) {
			getFile<File>(song.songFilename).then((initialSongFile) => {
				setSongFile(initialSongFile);
			});
		}

		if (song.coverArtFilename) {
			getFile<File>(song.coverArtFilename).then((initialSongFile) => {
				setCoverArtFile(initialSongFile);
			});
		}
	});

	const handleSubmit: FormEventHandler = async (ev) => {
		ev.preventDefault();

		// Alert the user if they need to choose a song before saving
		// TODO: I should go back to the default cover art if they remove the art.
		if (!songFile) {
			window.alert("Please select a song file before saving");
			return;
		}

		setStatus("working");

		const newSongObject = {
			...songData,
		};

		// When the user selects a file from their local machine, we store a File object type. BUT, when the user uploads a pre-existing map, the file is actually a Blob.
		// They're similar in many ways, but they don't have a filename, and that breaks things.
		// So, we should only try and save the cover art IF it's a proper file. If it's a blob, it can't have changed anyway.
		const shouldSaveCoverArt = coverArtFile?.name;

		if (shouldSaveCoverArt) {
			const [coverArtFilename] = await saveLocalCoverArtFile(song.id, coverArtFile);

			newSongObject.coverArtFilename = coverArtFilename;
		}

		if (songFile) {
			const [songFilename] = await saveSongFile(song.id, songFile);

			newSongObject.songFilename = songFilename;
		}

		// Update our redux state
		dispatch(updateSongDetails({ songId: song.id, songData: newSongObject }));

		// Back up our latest data!
		await saveInfoDat(
			song.id,
			createInfoContent(newSongObject, {
				version: 2,
			}),
		);

		setIsDirty(false);

		// HACK: It can take a bit of time to update. I don't have a simple way to do that since it all happens in a redux middleware.
		// The right solution is to track it in redux, but that feels like clutter and I lazy.
		// Waiting a couple secs should suffice.
		window.setTimeout(() => {
			setStatus("idle");
		}, 2000);
	};

	// TODO: I should probably add the SongPicker and CoverArtPicker components.
	// It's a bit more complicated since I need to allow them to be prepopulated, which the components don't currently support

	const isSaveDisabled = status === "working";

	useBlocker(() => (isDirty ? !window.confirm("You have unsaved changes! Are you sure you want to leave this page?") : false));

	return (
		<Wrapper>
			<InnerWrapper>
				<Spacer size={UNIT * 10} />
				<Heading size={1}>Edit Song Details</Heading>
				<Spacer size={UNIT * 6} />

				<form onSubmit={handleSubmit}>
					<Row>
						<div style={{ flex: 1 }}>
							<SongPicker height={MEDIA_ROW_HEIGHT} songFile={songFile} setSongFile={(file) => setSongProperty("songFile", file)} />
						</div>
						<Spacer size={UNIT * 2} />
						<div style={{ flexBasis: MEDIA_ROW_HEIGHT }}>
							<CoverArtPicker height={MEDIA_ROW_HEIGHT} coverArtFile={coverArtFile} setCoverArtFile={(file) => setSongProperty("coverArtFile", file)} />
						</div>
					</Row>
					<Spacer size={UNIT * 4} />

					<Row>
						<Cell>
							<TextInput required label="Song name" value={songData.name} placeholder="Radar" onChange={(ev) => setSongProperty("name", ev.target.value)} />
						</Cell>
						<Spacer size={UNIT * 4} />
						<Cell>
							<TextInput label="Song sub-name" value={songData.subName} placeholder="Original Mix" onChange={(ev) => setSongProperty("subName", ev.target.value)} />
						</Cell>
					</Row>
					<Row>
						<Cell>
							<TextInput required label="Artist name" value={songData.artistName} placeholder="Fox Stevenson" onChange={(ev) => setSongProperty("artistName", ev.target.value)} />
						</Cell>
						<Spacer size={UNIT * 4} />
						<Cell>
							<TextInput required label="Map author name" value={songData.mapAuthorName} onChange={(ev) => setSongProperty("mapAuthorName", ev.target.value)} />
						</Cell>
					</Row>

					<Row>
						<Cell>
							<TextInput required type="number" label="BPM" value={songData.bpm} placeholder="140" onChange={(ev) => setSongProperty("bpm", Number(ev.target.value))} />
						</Cell>
						<Spacer size={UNIT * 4} />
						<Cell>
							<TextInput type="number" label="Offset" value={songData.offset} placeholder="0" onChange={(ev) => setSongProperty("offset", Number(ev.target.value))} />
						</Cell>
						<Spacer size={UNIT * 4} />

						<Cell>
							<TextInput label="Swing amount" value={songData.swingAmount} placeholder="0" onChange={(ev) => setSongProperty("swingAmount", Number(ev.target.value))} />
						</Cell>
						<Spacer size={UNIT * 4} />
						<Cell>
							<TextInput label="Swing period" value={songData.swingPeriod} placeholder="0" onChange={(ev) => setSongProperty("swingPeriod", Number(ev.target.value))} />
						</Cell>
					</Row>

					<Row>
						<Cell>
							<TextInput required type="number" label="Preview start time" value={songData.previewStartTime} placeholder="(in seconds)" onChange={(ev) => setSongProperty("previewStartTime", Number(ev.target.value))} />
						</Cell>
						<Spacer size={UNIT * 4} />
						<Cell>
							<TextInput required type="number" label="Preview duration" value={songData.previewDuration} placeholder="(in seconds)" onChange={(ev) => setSongProperty("previewDuration", Number(ev.target.value))} />
						</Cell>
						<Spacer size={UNIT * 4} />

						<Cell>
							<DropdownInput label="Environment" value={songData.environment} displayValue={ENVIRONMENT_DISPLAY_MAP[songData.environment]} onChange={(ev) => setSongProperty("environment", ev.target.value)}>
								{Object.entries(ENVIRONMENT_DISPLAY_MAP).map(([id, label]) => (
									<option key={id} value={id}>
										{label}
									</option>
								))}
							</DropdownInput>
						</Cell>
					</Row>
					<Spacer size={UNIT * 2} />
					<Center>
						<Button disabled={isSaveDisabled} color={status === "success" ? COLORS.green[700] : undefined}>
							{status === "working" ? <Spinner size={16} /> : status === "success" ? "Saved!" : "Update song details"}
						</Button>
					</Center>
				</form>
				<Spacer size={UNIT * 8} />

				<Heading size={1}>Edit Difficulties</Heading>
			</InnerWrapper>

			<Spacer size={UNIT * 6} />

			<BeatmapsWrapper>
				<WrappedRow>
					{difficultyIds.map((difficultyId) => {
						return <BeatmapDifficultySettings key={difficultyId} difficultyId={difficultyId} song={song} />;
					})}
				</WrappedRow>
			</BeatmapsWrapper>

			<Spacer size={UNIT * 6} />

			<InnerWrapper>
				<Heading size={1}>Advanced Settings</Heading>
				<Spacer size={UNIT * 6} />
				<CustomColorSettings />
				<Spacer size={UNIT * 2} />
				<MappingExtensionSettings />
				<Spacer size={UNIT * 2} />
				<LabeledCheckbox id="enable-lightshow" checked={!!enabledLightshow} onChange={() => dispatch(togglePropertyForSelectedSong({ property: "enabledLightshow" }))}>
					Includes "Lightshow" difficulty{" "}
					<QuestionTooltip>
						If enabled, adds a non-standard difficulty with all blocks removed. Nice to include if your lighting is spectacular{" "}
						<span role="img" aria-label="sparkles">
							✨
						</span>
					</QuestionTooltip>
				</LabeledCheckbox>
				<Spacer size={UNIT * 2} />
				<LabeledCheckbox id="enable-fast-walls" checked={!!enabledFastWalls} onChange={() => dispatch(togglePropertyForSelectedSong({ property: "enabledFastWalls" }))}>
					Enable "fast walls"{" "}
					<QuestionTooltip>
						Fast walls exploit a loophole in the game to allow walls to blur by at high speed{" "}
						<Link forceAnchor to="/docs/mods#mapping-extensions">
							Learn more
						</Link>
						.
					</QuestionTooltip>
				</LabeledCheckbox>
			</InnerWrapper>

			<Spacer size={UNIT * 36} />
		</Wrapper>
	);
};

const Wrapper = styled.div`
  max-height: 100vh;
  overflow: auto;
`;

const InnerWrapper = styled.div`
  padding-left: ${UNIT * 4}px;
  padding-right: ${UNIT * 4}px;
  /*
    HACK: These magic numbers are necessary because SongPicker uses
    ScrubbableWaveform, which assumes a 500px width, and sits beside
    CoverArtPicker, which is a MEDIA_ROW_HEIGHT-sized square. Plus padding.
    No clue why the +4 is needed
  */
  width: ${500 + MEDIA_ROW_HEIGHT + UNIT * 4 + UNIT * 8 + 4}px;
  margin: auto;
`;

const BeatmapsWrapper = styled(InnerWrapper)`
  /*
    On larger screens, it looks better if we squeeze more difficulties in per
    row.
  */
  width: auto;
  max-width: 865px;

  @media (min-width: 1155px) {
    max-width: 1095px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${UNIT * 4}px;
`;
const WrappedRow = styled(Row)`
  flex-wrap: wrap;
  justify-content: center;
`;

const Cell = styled.div`
  flex: 1;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

export default SongDetails;
