import React from "react";
import { connect } from "react-redux";

import * as actions from "$/store/actions";
import { EventEditMode, EventTool, View } from "$/types";
import { isMetaKeyPressed } from "$/utils";

const KeyboardShortcuts = ({ selectTool, selectEventEditMode, toggleSelectAll, zoomOut, zoomIn, toggleEventWindowLock, toggleLaserLock }) => {
	const handleKeyDown = (ev) => {
		switch (ev.code) {
			case "NumpadSubtract":
			case "Minus": {
				return zoomOut();
			}
			case "Equal": {
				if (ev.shiftKey) {
					// Shift+Equal is "Plus"
					return zoomIn();
				}

				break;
			}
			case "NumpadAdd": {
				return zoomIn();
			}

			case "KeyA": {
				if (isMetaKeyPressed(ev)) {
					ev.preventDefault();
					return toggleSelectAll(View.LIGHTSHOW);
				}

				return selectEventEditMode(EventEditMode.PLACE);
			}

			case "KeyS": {
				return selectEventEditMode(EventEditMode.SELECT);
			}

			case "KeyZ": {
				if (isMetaKeyPressed(ev)) {
					return;
				}

				ev.stopPropagation();
				return toggleEventWindowLock();
			}

			case "KeyX": {
				if (isMetaKeyPressed(ev)) {
					return;
				}

				ev.stopPropagation();
				return toggleLaserLock();
			}

			case "Digit1": {
				return selectTool(View.LIGHTSHOW, EventTool.ON);
			}
			case "Digit2": {
				return selectTool(View.LIGHTSHOW, EventTool.OFF);
			}
			case "Digit3": {
				return selectTool(View.LIGHTSHOW, EventTool.FLASH);
			}
			case "Digit4": {
				return selectTool(View.LIGHTSHOW, EventTool.FADE);
			}

			default:
				return;
		}
	};

	React.useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	});

	return null;
};

const mapDispatchToProps = {
	selectTool: actions.selectTool,
	selectEventEditMode: actions.selectEventEditMode,
	toggleSelectAll: actions.toggleSelectAll,
	zoomOut: actions.zoomOut,
	zoomIn: actions.zoomIn,
	toggleEventWindowLock: actions.toggleEventWindowLock,
	toggleLaserLock: actions.toggleLaserLock,
};

export default connect(null, mapDispatchToProps)(KeyboardShortcuts);
