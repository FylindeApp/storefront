import { FC, ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "secondary" | "tertiary";
	ariaLabel?: string;
	ariaDisabled?: boolean;
	fullwidth?: boolean; // ✅ Added fullwidth prop
}

export const Button: FC<ButtonProps> = ({
	children,
	className,
	variant = "primary",
	disabled = false,
	type = "button",
	ariaLabel,
	ariaDisabled = false,
	fullwidth = false, // ✅ Default to false
	...rest
}) => {
	const isDisabled = disabled || ariaDisabled;

	const classes = clsx(
		"inline-flex h-10 items-center justify-center whitespace-nowrap rounded border active:outline-none",
		{
			"bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-700 text-white px-4 aria-disabled:cursor-not-allowed aria-disabled:opacity-70 hover:aria-disabled:bg-neutral-700":
				variant === "primary",
			"border-neutral-600 hover:border-neutral-700 hover:bg-neutral-300 active:bg-neutral-300 disabled:border-neutral-300 aria-disabled:border-neutral-300 bg-transparent disabled:bg-transparent aria-disabled:bg-transparent px-4":
				variant === "secondary",
			"h-auto border-none bg-transparent p-0": variant === "tertiary",
			"w-full": fullwidth, // ✅ Apply full width if true
		},
		className
	);

	return (
		<button
			aria-label={ariaLabel}
			aria-disabled={ariaDisabled}
			disabled={isDisabled}
			className={classes}
			type={type === "submit" ? "submit" : "button"}
			{...rest}
		>
			{typeof children === "string" ? <span className="font-semibold">{children}</span> : children}
		</button>
	);
};
