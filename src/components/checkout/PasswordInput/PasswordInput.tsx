"use client";

import { useState } from "react";
import clsx from "clsx";
import { useField } from "formik";
import { EyeHiddenIcon, EyeIcon } from "../../icons";
import { IconButton } from "../IconButton";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ name, label, required, ...props }) => {
	const [field, meta] = useField(name);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const error = meta.touched && meta.error ? meta.error : "";

	return (
		<div className="space-y-0.5">
			<label className="text-xs text-neutral-700" htmlFor={name}>
				{label}
				{required && <span aria-hidden="true">*</span>}
			</label>

			<div className="relative mt-1 flex items-stretch shadow-sm">
				<input
					{...field}
					{...props}
					id={name}
					required={required}
					spellCheck={false}
					type={passwordVisible ? "text" : "password"}
					autoCapitalize="off"
					autoComplete="off"
					aria-describedby={error ? `${name}-error` : undefined}
					className={clsx(
						"block w-full appearance-none rounded-md border border-neutral-300 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50",
						{ "border-red-500": error }
					)}
				/>
				<IconButton
					ariaLabel="Toggle password visibility"
					onClick={() => setPasswordVisible(!passwordVisible)}
					icon={passwordVisible ? <EyeIcon /> : <EyeHiddenIcon />}
					className="absolute right-2 top-1/2 transform -translate-y-1/2"
				/>
			</div>

			{error && <p id={`${name}-error`} className="text-sm text-red-500">{error}</p>}
		</div>
	);
};
