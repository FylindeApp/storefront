import clsx from "clsx";
import React from "react";

export interface SkeletonProps {
	className?: string;
	variant?: "paragraph" | "title";
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = "paragraph" }) => {
	const classes = clsx(
		"bg-neutral-100 mb-2 h-3 min-w-[250px] rounded",
		{ "mb-6 w-1/3": variant === "title", "h-3": variant === "paragraph" },
		className
	);

	return <div className={classes} />;
};
