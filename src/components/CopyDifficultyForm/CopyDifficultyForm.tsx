// TODO: Possibly dedupe with CreateDifficultyForm?
import { Fragment, useState } from "react";
import { Tooltip } from "react-tippy";
import styled from "styled-components";

import { COLORS, DIFFICULTIES, UNIT } from "$/constants";
import { getLabelForDifficulty, sortDifficultyIds } from "$/helpers/song.helpers";
import type { App, BeatmapId, SongId } from "$/types";

import Button from "../Button";
import DifficultyTag from "../DifficultyTag";
import Heading from "../Heading";
import Paragraph from "../Paragraph";
import Spacer from "../Spacer";

interface Props {
	song: App.Song;
	idToCopy: BeatmapId;
	afterCopy: (id: BeatmapId) => void;
	copyDifficulty: (songId: SongId, fromDifficultyId: BeatmapId, toDifficultyId: BeatmapId, afterCopy: (id: BeatmapId) => void) => void;
}

const CopyDifficultyForm = ({ song, idToCopy, afterCopy, copyDifficulty }: Props) => {
	const difficultyIds = sortDifficultyIds(Object.keys(song.difficultiesById));
	const [selectedId, setSelectedId] = useState<BeatmapId | null>(null);

	// If we already have all difficulties, let the user know
	if (difficultyIds.length === DIFFICULTIES.length) {
		return (
			<Wrapper>
				<Heading size={1}>All beatmaps created</Heading>
				<Spacer size={UNIT * 4} />
				<Paragraph>You already have beatmaps for every difficulty, and you can only copy beatmaps for difficulties that don't yet exist. Please delete the beatmap for the difficulty you'd like to copy to.</Paragraph>
			</Wrapper>
		);
	}

	// Don't render the one we're copying.
	// Eg. if the user wants to copy Ex+ to Ex, don't show the Ex+ in the list of options to copy to.
	const difficultiesToRender = DIFFICULTIES.filter((d) => d !== idToCopy);

	return (
		<Wrapper>
			<Heading size={1}>Copy beatmap </Heading>
			<Spacer size={UNIT * 2} />
			<Paragraph>
				Copy the <Highlight>{getLabelForDifficulty(idToCopy)}</Highlight> beatmap for another difficulty:
			</Paragraph>
			<Spacer size={UNIT * 4} />
			<DifficultiesWrapper>
				{difficultiesToRender.map((difficulty) => {
					const alreadyExists = difficultyIds.includes(difficulty);

					return (
						<Fragment key={difficulty}>
							{alreadyExists ? (
								<Tooltip title="You already have a beatmap for this difficulty">
									<DifficultyTag disabled width={120} difficulty={difficulty} isSelected={selectedId === difficulty} onSelect={setSelectedId} />
								</Tooltip>
							) : (
								<DifficultyTag width={120} difficulty={difficulty} isSelected={selectedId === difficulty} onSelect={setSelectedId} />
							)}
							<br />
						</Fragment>
					);
				})}
			</DifficultiesWrapper>
			<Spacer size={UNIT * 4} />
			{selectedId && (
				<Button
					style={{ width: 275, margin: "auto" }}
					onClick={() => {
						copyDifficulty(song.id, idToCopy, selectedId, afterCopy);
					}}
				>
					Copy beatmap
				</Button>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
  padding: ${UNIT * 4}px;
  text-align: center;
`;

const Highlight = styled.span`
  color: ${COLORS.yellow[500]};
  font-weight: 500;
`;

const DifficultiesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export default CopyDifficultyForm;
