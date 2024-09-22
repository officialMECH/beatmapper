import { useSelector } from "react-redux";
import styled from "styled-components";

import { COLORS } from "$/constants";
import { getCursorPositionInBeats } from "$/store/selectors";
import { normalize } from "$/utils";

const CursorPositionIndicator = ({ gridWidth, startBeat, endBeat, zIndex }) => {
	const cursorPositionInBeats = useSelector(getCursorPositionInBeats);

	const cursorOffsetInWindow = normalize(cursorPositionInBeats, startBeat, endBeat, 0, gridWidth);

	return (
		<Elem
			style={{
				transform: `translateX(${cursorOffsetInWindow}px)`,
				zIndex,
			}}
		/>
	);
};

const Elem = styled.div`
  position: absolute;
  top: 0;
  left: -1.5px;
  width: 3px;
  height: 100%;
  background: ${COLORS.yellow[500]};
  border-radius: 4px;
  pointer-events: none;
`;

export default CursorPositionIndicator;
