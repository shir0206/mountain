import { useCallback, useRef, useState } from "react";

export function useHtmlReady<T extends HTMLElement>() {
	const [ready, setReady] = useState(false);
	const nodeRef = useRef<T | null>(null);

	const ref = useCallback((node: T | null) => {
		nodeRef.current = node;
		if (node) setReady(true);
	}, []);

	return { ref, nodeRef, ready };
}