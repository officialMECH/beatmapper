import React from "react";
import { connect } from "react-redux";

import * as actions from "$/store/actions";
import { getDefaultObstacleDuration } from "$/store/reducers/editor.reducer";
import { Direction, ObjectTool, View } from "$/types";
import { isMetaKeyPressed } from "$/utils";

const KeyboardShortcuts = ({ defaultObstacleDuration, selectTool, selectNoteDirection, swapSelectedNotes, toggleSelectAll }) => {
	const keysDepressed = React.useRef({
		w: false,
		a: false,
		s: false,
		d: false,
	});

	const handleKeyDown = (ev) => {
		switch (ev.code) {
			case "Digit1":
				// Ignore meta+number, since that's used for snapping intervals
				if (isMetaKeyPressed(ev)) {
					return;
				}
				return selectTool(View.BEATMAP, ObjectTool.LEFT_NOTE);
			case "Digit2":
				if (isMetaKeyPressed(ev)) {
					return;
				}
				return selectTool(View.BEATMAP, ObjectTool.RIGHT_NOTE);
			case "Digit3":
				if (isMetaKeyPressed(ev)) {
					return;
				}
				return selectTool(View.BEATMAP, ObjectTool.BOMB_NOTE);
			case "Digit4":
				if (isMetaKeyPressed(ev)) {
					return;
				}
				return selectTool(View.BEATMAP, ObjectTool.OBSTACLE);

			case "KeyH": {
				return swapSelectedNotes("horizontal");
			}
			case "KeyV": {
				// If the user is pasting with Meta+V, ignore.
				if (isMetaKeyPressed(ev)) {
					return;
				}
				return swapSelectedNotes("vertical");
			}

			case "KeyW": {
				if (ev.shiftKey) {
					return;
				}
				keysDepressed.current.w = true;

				if (keysDepressed.current.a) {
					return selectNoteDirection(Direction.UP_RIGHT);
				}
				if (keysDepressed.current.d) {
					return selectNoteDirection(Direction.UP_LEFT);
				}
				return selectNoteDirection(Direction.UP);
			}
			case "KeyA": {
				if (ev.shiftKey) {
					return;
				}
				if (isMetaKeyPressed(ev)) {
					ev.preventDefault();
					return toggleSelectAll(View.BEATMAP);
				}

				keysDepressed.current.a = true;

				if (keysDepressed.current.w) {
					return selectNoteDirection(Direction.UP_LEFT);
				}
				if (keysDepressed.current.s) {
					return selectNoteDirection(Direction.DOWN_LEFT);
				}
				return selectNoteDirection(Direction.LEFT);
			}
			case "KeyS": {
				if (ev.shiftKey) {
					return;
				}
				keysDepressed.current.s = true;

				if (keysDepressed.current.a) {
					return selectNoteDirection(Direction.DOWN_LEFT);
				}
				if (keysDepressed.current.d) {
					return selectNoteDirection(Direction.DOWN_RIGHT);
				}
				return selectNoteDirection(Direction.DOWN);
			}
			case "KeyD": {
				if (ev.shiftKey) {
					return;
				}
				keysDepressed.current.d = true;

				if (keysDepressed.current.w) {
					return selectNoteDirection(Direction.UP_RIGHT);
				}
				if (keysDepressed.current.s) {
					return selectNoteDirection(Direction.DOWN_RIGHT);
				}
				return selectNoteDirection(Direction.RIGHT);
			}

			case "KeyF": {
				if (ev.shiftKey) {
					return;
				}

				return selectNoteDirection(Direction.ANY);
			}

			case "Numpad1": {
				return selectNoteDirection(Direction.DOWN_LEFT);
			}
			case "Numpad2": {
				return selectNoteDirection(Direction.DOWN);
			}
			case "Numpad3": {
				return selectNoteDirection(Direction.DOWN_RIGHT);
			}
			case "Numpad4": {
				return selectNoteDirection(Direction.LEFT);
			}
			case "Numpad5": {
				return selectNoteDirection(Direction.ANY);
			}
			case "Numpad6": {
				return selectNoteDirection(Direction.RIGHT);
			}
			case "Numpad7": {
				return selectNoteDirection(Direction.UP_LEFT);
			}
			case "Numpad8": {
				return selectNoteDirection(Direction.UP);
			}
			case "Numpad9": {
				return selectNoteDirection(Direction.UP_RIGHT);
			}

			default:
				return;
		}
	};

	const handleKeyUp = (ev) => {
		switch (ev.code) {
			case "KeyW": {
				keysDepressed.current.w = false;
				break;
			}
			case "KeyA": {
				keysDepressed.current.a = false;
				break;
			}
			case "KeyS": {
				keysDepressed.current.s = false;
				break;
			}
			case "KeyD": {
				keysDepressed.current.d = false;
				break;
			}

			default:
				return;
		}
	};

	React.useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	});

	return null;
};

const mapStateToProps = (state) => {
	return {
		defaultObstacleDuration: getDefaultObstacleDuration(state),
	};
};

const mapDispatchToProps = {
	selectTool: actions.selectTool,
	selectNoteDirection: actions.selectNoteDirection,
	swapSelectedNotes: actions.swapSelectedNotes,
	toggleSelectAll: actions.toggleSelectAll,
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardShortcuts);
