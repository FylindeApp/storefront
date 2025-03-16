import clsx from "clsx";
import { type ReactNode } from "react";
import { Classes } from "./lib/globalTypes";

interface SelectBoxGroupProps extends Classes {
	label: string;
	children?: ReactNode;
}

export const SelectBoxGroup = ({ label, children, className }: SelectBoxGroupProps) => {
	return (
		<div
			role="radiogroup"
			aria-label={label}
			className={clsx("grid gap-x-2 md:grid-cols-2", className)}
		>
			{children}
		</div>
	);
};
