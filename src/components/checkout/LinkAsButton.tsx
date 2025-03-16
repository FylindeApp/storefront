import { type ReactNode, type AnchorHTMLAttributes, FC } from "react";
import clsx from "clsx";

interface LinkAsButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	children: ReactNode;
	href: string;
	variant?: "primary" | "secondary" | "tertiary";
	className?: string; // ✅ Allow custom styling
	disabled?: boolean; // ✅ Handle disabled state
}

export const LinkAsButton: FC<LinkAsButtonProps> = ({
	children,
	href,
	variant = "primary",
	className,
	disabled = false,
	...rest
}) => {
	const classes = clsx(
		"inline-flex h-10 items-center justify-center whitespace-nowrap rounded border active:outline-none font-bold",
		{
			"bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-700 text-white px-4 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700":
				variant === "primary",
			"border-neutral-600 hover:border-neutral-700 hover:bg-neutral-300 active:bg-neutral-300 disabled:border-neutral-300 aria-disabled:border-neutral-300 bg-transparent disabled:bg-transparent aria-disabled:bg-transparent px-4":
				variant === "secondary",
			"h-auto border-none bg-transparent p-0": variant === "tertiary",
		},
		className // ✅ Merge custom styles
	);

	return (
		<a
			href={disabled ? "#" : href} // ✅ Prevent navigation if disabled
			className={classes}
			aria-disabled={disabled} // ✅ Improve accessibility
			tabIndex={disabled ? -1 : undefined} // ✅ Prevent keyboard focus when disabled
			{...rest} // ✅ Spread additional props
		>
			{children}
		</a>
	);
};
