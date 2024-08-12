import slugify from "slugify";

import type { Difficulty } from "../types";

export const getSongIdFromName = (songName: string): string => {
	const songId = slugify(songName).toLowerCase();

	return songId;
};

export const getLabelForDifficulty = (difficulty: Difficulty) => {
	if (difficulty === "ExpertPlus") {
		return "Expert+";
	}
	return difficulty;
};

export const sortDifficultyIds = (difficultyIds: Array<Difficulty>) => {
	const order = ["Easy", "Normal", "Hard", "Expert", "ExpertPlus"];
	return difficultyIds.sort((a, b) => {
		const aIndex = order.indexOf(a);
		const bIndex = order.indexOf(b);

		return aIndex > bIndex ? 1 : -1;
	});
};
