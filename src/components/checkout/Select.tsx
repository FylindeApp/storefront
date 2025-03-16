import { type FC, type SelectHTMLAttributes, type ChangeEvent, type ReactNode } from "react";
import { useField } from "./hooks/useForm/useField";

export interface Option<TData extends string = string> {
	label: ReactNode;
	value: TData;
	disabled?: boolean;
	icon?: ReactNode;
}

interface SelectProps<TName extends string, TData extends string>
	extends SelectHTMLAttributes<HTMLSelectElement> {
	name: TName;
	label?: ReactNode;
	onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
	options: Option<TData>[];
	placeholder?: string;
}

export const Select: FC<SelectProps<string, string>> = ({
	name,
	placeholder,
	onChange,
	options,
	label,
	...rest
}) => {
	const { error, handleBlur, ...fieldProps } = useField(name);

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		if (!event.currentTarget.value) return;

		onChange?.(event);
		fieldProps.onChange(event);
	};

	return (
		<div className="space-y-0.5">
			{label && <label className="text-xs text-neutral-700">{label}</label>}
			<select
				{...fieldProps}
				{...rest}
				onBlur={handleBlur}
				onChange={handleChange}
				className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-300 focus:ring focus:ring-neutral-200 focus:ring-opacity-50"
			>
				{placeholder && (
					<option disabled value="">
						{placeholder}
					</option>
				)}
				{options.map(({ label, value, disabled = false }) => (
					<option value={value} disabled={disabled} key={label?.toString() + "_" + value}>
						{label}
					</option>
				))}
			</select>
			{error && <p className="text-sm text-red-500">{error}</p>}
		</div>
	);
};
