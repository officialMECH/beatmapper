import styled from "styled-components";

import { pixelSrc } from "$/assets";

const Spacer = styled.img.attrs({
	src: pixelSrc,
})`
  display: block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  pointer-events: none;
  user-select: none;
`;

export default Spacer;
