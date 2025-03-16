import { type ButtonHTMLAttributes, type ReactNode, FC } from "react";
import clsx from "clsx"; // ✅ Lightweight class merging

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	icon?: ReactNode;
	ariaLabel?: string;
	className?: string;
	variant?: "text" | "outlined" | "contained"; // ✅ Added variant support
	size?: "small" | "medium" | "large"; // ✅ Added size support
	bg?: string; // ✅ Background color
	p?: string; // ✅ Padding
}

export const IconButton: FC<IconButtonProps> = ({
	icon,
	ariaLabel = "icon button", // ✅ Default for accessibility
	className,
	variant = "text", // ✅ Default to text
	size = "medium", // ✅ Default size
	bg = "", // ✅ Background color
	p = "", // ✅ Padding
	...rest
}) => {
	return (
		<button
			aria-label={ariaLabel}
			type="button"
			className={clsx(
				"flex items-center justify-center rounded-md transition-all focus:outline-none focus:ring focus:ring-neutral-200",
				{
					"bg-transparent text-neutral-900 hover:bg-neutral-200": variant === "text",
					"border border-neutral-900 text-neutral-900 hover:bg-neutral-100": variant === "outlined",
					"bg-neutral-900 text-white hover:bg-neutral-800": variant === "contained",
					"p-1 text-sm": size === "small",
					"p-2 text-base": size === "medium",
					"p-3 text-lg": size === "large",
				},
				bg && `bg-${bg}`, // ✅ Apply bg if provided
				p && `p-${p}`,   // ✅ Apply padding if provided
				className // ✅ Allow additional custom styles
			)}
			{...rest}
		>
			{icon && icon}
		</button>
	);
};
