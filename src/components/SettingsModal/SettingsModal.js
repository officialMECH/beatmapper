import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { UNIT } from "$/constants";
import { updateGraphicsLevel, updateProcessingDelay } from "$/store/actions";
import { getGraphicsLevel, getProcessingDelay } from "$/store/selectors";
import { Quality } from "$/types";
import { capitalize } from "$/utils";

import Heading from "../Heading";
import Modal from "../Modal";
import QuestionTooltip from "../QuestionTooltip";
import RadioSet from "../RadioSet";
import Spacer from "../Spacer";
import TextInput from "../TextInput";

const SettingsModal = ({ isVisible, onDismiss }) => {
	const processingDelay = useSelector(getProcessingDelay);
	const graphicsLevel = useSelector(getGraphicsLevel);
	const dispatch = useDispatch();

	const QUALITY_VALUES = useMemo(() => Object.values(Quality).map((value) => ({ value, label: capitalize(value) })), []);
	return (
		<Modal width={400} isVisible={isVisible} onDismiss={onDismiss}>
			<Wrapper>
				<Heading size={1}>App settings</Heading>
				<Spacer size={UNIT * 6} />

				<RadioSet label="Graphics quality" name="graphics-level" currentValue={graphicsLevel} items={QUALITY_VALUES} onChange={(value) => dispatch(updateGraphicsLevel({ newGraphicsLevel: value }))} />

				<Spacer size={UNIT * 4} />

				<TextInput
					label={
						<span>
							Processing delay{" "}
							<QuestionTooltip animateFill={false}>
								Tweak the amount of time, in milliseconds, that the audio should be offset by, for it to seem synchronized.
								<br />
								<br />
								Slower machines should experiment with larger numbers.
							</QuestionTooltip>
						</span>
					}
					value={processingDelay}
					onChange={(ev) => dispatch(updateProcessingDelay({ newDelay: Number(ev.target.value) }))}
				/>
			</Wrapper>
		</Modal>
	);
};

const Wrapper = styled.div`
  padding: ${UNIT * 4}px;
`;

export default SettingsModal;
