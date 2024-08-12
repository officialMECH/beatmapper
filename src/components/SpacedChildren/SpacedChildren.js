import React from "react";

import { UNIT } from "../../constants";
import Spacer from "../Spacer";

const SpacedChildren = ({ children, spacing = UNIT }) => {
	return React.Children.map(children, (child, index) => [child, <Spacer key={index} size={spacing} />]);
};

export default SpacedChildren;
