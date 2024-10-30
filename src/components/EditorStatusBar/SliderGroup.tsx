import type { ComponentProps } from "react";
import type { IconProp } from "react-icons-kit";
import styled from "styled-components";

import { UNIT } from "$/constants";

import MiniSlider from "../MiniSlider";
import Spacer from "../Spacer";
import StatusIcon from "./StatusIcon";

interface Props extends Omit<ComponentProps<typeof MiniSlider>, "width" | "onChange"> {
	width: number;
	onChange: (value: ComponentProps<typeof MiniSlider>["value"]) => void;
	minIcon: IconProp["icon"];
	maxIcon: IconProp["icon"];
}

const SliderGroup = ({ width, height, minIcon, maxIcon, min, max, step, value, onChange, disabled, ...delegated }: Props) => (
	<Wrapper>
		<StatusIcon disabled={disabled} icon={minIcon} onClick={() => onChange(min)} />
		<Spacer size={UNIT} />
		<MiniSlider width={width} height={height} min={min} max={max} step={typeof step === "number" ? step : 1 / width} value={value} onChange={(ev) => onChange(Number(ev.target.value))} disabled={disabled} {...delegated} />
		<Spacer size={UNIT} />
		<StatusIcon disabled={disabled} icon={maxIcon} onClick={() => onChange(max)} />
	</Wrapper>
);

const Wrapper = styled.div`
  display: flex;
`;

export default SliderGroup;
