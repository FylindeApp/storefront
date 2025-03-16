import React from "react";
import clsx from "clsx";

interface DividerProps {
	className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className }) => {
	return <div className={clsx("border-neutral-200 h-px w-full border-t", className)} />;
};
