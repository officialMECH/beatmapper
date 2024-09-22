import { useSelector } from "react-redux";

import { getFormattedTimestamp } from "$/helpers/audio.helpers";
import { getCursorPosition } from "$/store/selectors";

import LabeledNumber from "../LabeledNumber";

const CurrentTime = () => {
	const displayString = useSelector((state) => {
		const cursorPosition = getCursorPosition(state);
		return getFormattedTimestamp(cursorPosition);
	});
	return <LabeledNumber label="Time">{displayString}</LabeledNumber>;
};

export default CurrentTime;
