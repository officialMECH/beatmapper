import { useDispatch, useSelector } from "react-redux";

import { convertMillisecondsToBeats } from "$/helpers/audio.helpers";
import { deleteBookmark, jumpToBeat } from "$/store/actions";
import { getSortedBookmarksArray } from "$/store/reducers/bookmarks.reducer";
import { getDurationInBeats } from "$/store/reducers/navigation.reducer";
import { getSelectedSong } from "$/store/reducers/songs.reducer";

import BookmarkFlag from "./BookmarkFlag";

const Bookmarks = () => {
	const bookmarks = useSelector(getSortedBookmarksArray);
	const durationInBeats = useSelector(getDurationInBeats);
	const offsetInBeats = useSelector((state) => {
		const selectedSong = getSelectedSong(state);
		return convertMillisecondsToBeats(selectedSong.offset, selectedSong.bpm);
	});
	const dispatch = useDispatch();

	// Add the bookmarks in reverse.
	// This way, they stack from left to right, so earlier flags sit in front of
	// later ones. This is important when hovering, to be able to see the flag
	// name
	return [...bookmarks].reverse().map((bookmark) => {
		const beatNumWithOffset = bookmark.beatNum + offsetInBeats;
		const offsetPercentage = (beatNumWithOffset / durationInBeats) * 100;

		return <BookmarkFlag key={bookmark.beatNum} bookmark={bookmark} offsetPercentage={offsetPercentage} handleJump={() => dispatch(jumpToBeat({ beatNum: bookmark.beatNum }))} handleDelete={() => dispatch(deleteBookmark({ beatNum: bookmark.beatNum }))} />;
	});
};

export default Bookmarks;
