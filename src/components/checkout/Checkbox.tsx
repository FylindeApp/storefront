import React from "react";
import { useField } from "formik";
import { useFormContext } from "./hooks/useForm";

interface CheckboxProps<TName extends string> {
	name: TName;
	label: string;
}

export const Checkbox = <TName extends string>({ name, label }: CheckboxProps<TName>) => {
	const { handleChange } = useFormContext<Record<TName, boolean>>();
	const [{ value }] = useField<boolean>(name);

	return (
		<label className="inline-flex items-center gap-x-2">
			<input
				type="checkbox"
				name={name}
				checked={Boolean(value)} // ✅ Ensure proper boolean handling
				aria-checked={Boolean(value)}
				onChange={handleChange} // ✅ Pass the event instead of a boolean
				className="rounded border-neutral-300 text-neutral-600 shadow-sm focus:border-neutral-300"
			/>
			<span>{label}</span>
		</label>
	);
};
