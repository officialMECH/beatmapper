import slugify from "slugify";

import { DIFFICULTIES } from "$/constants";
import { Difficulty } from "$/types";

export const getSongIdFromName = (songName: string): string => {
	const songId = slugify(songName).toLowerCase();

	return songId;
};

export const getLabelForDifficulty = (difficulty: Difficulty) => {
	if (difficulty === Difficulty.EXPERT_PLUS) {
		return "Expert+";
	}
	return difficulty;
};

export const sortDifficultyIds = (difficultyIds: Array<Difficulty>) => {
	return difficultyIds.sort((a, b) => {
		const aIndex = DIFFICULTIES.indexOf(a);
		const bIndex = DIFFICULTIES.indexOf(b);
		return aIndex > bIndex ? 1 : -1;
	});
};
