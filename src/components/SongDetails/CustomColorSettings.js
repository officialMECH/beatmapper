import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { COLOR_ELEMENT_DATA, COLOR_ELEMENT_IDS, UNIT } from "$/constants";
import * as actions from "$/store/actions";
import { getCustomColors } from "$/store/reducers/songs.reducer";

import CenteredSpinner from "../CenteredSpinner";
import Heading from "../Heading";
import LabeledCheckbox from "../LabeledCheckbox";
import Link from "../Link";
import MiniSlider from "../MiniSlider";
import QuestionTooltip from "../QuestionTooltip";
import Spacer from "../Spacer";

const ColorPicker = React.lazy(() => import("../ColorPicker"));

const CustomColorSettings = ({ customColors, toggleModForSong, updateModColor, updateModColorOverdrive }) => {
	return (
		<Wrapper>
			<LabeledCheckbox id="enable-colors" checked={customColors.isEnabled} onChange={() => toggleModForSong("customColors")}>
				Enable custom colors{" "}
				<QuestionTooltip>
					Override the default red/blue color scheme. Use "overdrive" to produce some neat effects.{" "}
					<Link forceAnchor to="/docs/mods#custom-colors">
						Learn more
					</Link>
					.
				</QuestionTooltip>
			</LabeledCheckbox>

			{customColors.isEnabled && (
				<React.Suspense fallback={<CenteredSpinner />}>
					<Spacer size={UNIT * 4} />
					<Row>
						{COLOR_ELEMENT_IDS.map((elementId) => {
							const color = customColors[elementId];
							const overdrive = customColors[`${elementId}Overdrive`];

							return (
								<Cell key={elementId}>
									<ColorPicker colorId={elementId} color={color} updateColor={updateModColor} overdrive={overdrive} />
									<Spacer size={UNIT * 2} />
									<Heading size={3}>{COLOR_ELEMENT_DATA[elementId].label}</Heading>
									<Spacer size={UNIT * 3} />
									<Heading size={4}>Overdrive</Heading>
									<Spacer size={UNIT * 1} />
									<MiniSlider
										width={50}
										height={16}
										min={0}
										max={1}
										step={0.01}
										value={overdrive}
										onChange={(ev) => {
											updateModColorOverdrive(elementId, Number(ev.target.value));
										}}
									/>
								</Cell>
							);
						})}
					</Row>
					<Spacer size={UNIT * 4} />
				</React.Suspense>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
  user-select: none;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Cell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const mapStateToProps = (state) => ({
	customColors: getCustomColors(state),
});

const mapDispatchToProps = {
	toggleModForSong: actions.toggleModForSong,
	updateModColor: actions.updateModColor,
	updateModColorOverdrive: actions.updateModColorOverdrive,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomColorSettings);
