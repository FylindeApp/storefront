import { type ReactNode } from "react";
import clsx from "clsx"; // ✅ For better class merging

type Props = {
	children: ReactNode;
	className?: string; // ✅ Allow custom styling
};

export const ErrorContentWrapper: React.FC<Props> = ({ children, className }) => {
	return (
		<div
			className={clsx(
				"mx-auto flex max-w-screen-sm flex-col items-center gap-y-4 bg-neutral-50 px-8 py-16 text-center",
				className // ✅ Merge custom styles
			)}
		>
			{children}
		</div>
	);
};
