import { type EffectCallback, useRef } from "react";

export function useOnChange(callback: EffectCallback, id: string) {
	const cachedId = useRef(id);

	const idChanged = id !== cachedId.current;

	if (idChanged) {
		callback();

		cachedId.current = id;
	}
}
