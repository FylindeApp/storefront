import clsx from "clsx";
import { ReactNode, LabelHTMLAttributes } from "react";
import { useField } from "formik";
import { useFormContext } from "../hooks/useForm";

export interface SelectBoxProps<TName extends string> extends LabelHTMLAttributes<HTMLLabelElement> {
	disabled?: boolean;
	name: TName;
	value: string;
	children: ReactNode;
}

export const SelectBox = <TName extends string>({
	children,
	className,
	disabled = false,
	name,
	value,
}: SelectBoxProps<TName>) => {
	const { values, handleChange } = useFormContext<Record<TName, string>>();
	const [field] = useField(name);
	const selected = values?.[name] === value; // Ensure values[name] exists before comparison

	return (
		<label
			className={clsx(
				"relative mb-2 flex cursor-pointer flex-row items-center justify-start rounded border border-neutral-400 px-3 py-2",
				"hover:border hover:border-neutral-500",
				{ "border border-neutral-500": selected, "pointer-events-none hover:border-neutral-400": disabled },
				className
			)}
		>
			<input
				type="radio"
				{...field}
				onChange={handleChange}
				value={value}
				checked={selected}
				disabled={disabled}
				className="rounded-full border-neutral-300 text-neutral-600 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50 focus:ring-offset-0"
			/>
			<span className="ml-2 block w-full">{children}</span>
		</label>
	);
};
