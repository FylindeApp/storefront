import { debounce } from "lodash-es";
import { useMemo, useEffect } from "react";

export const useDebouncedSubmit = <TArgs extends Array<any>>(
	onSubmit: (...args: TArgs) => Promise<any> | void,
) => {
	// ✅ Use `useMemo` to prevent re-creating debounce function on every render
	const debouncedSubmit = useMemo(
		() =>
			debounce((...args: TArgs) => {
				void onSubmit(...args);
			}, 2000),
		[onSubmit], // ✅ Only re-create when `onSubmit` changes
	);

	useEffect(() => {
		return () => {
			debouncedSubmit.cancel();
		};
	}, [debouncedSubmit]); // ✅ Correct dependency array

	return debouncedSubmit;
};
