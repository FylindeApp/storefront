"use client";
import { useState } from "react";
import { getServerAuthClient } from "../config/config";

export async function LoginForm() {
	const [errors, setErrors] = useState<string[]>([]);
	const [formValues, setFormValues] = useState({ email: "", password: "" });

	const DefaultValues = { email: "", password: "" };

	return (
		<div className="mx-auto mt-16 w-full max-w-lg">
			<form
				className="rounded border p-8 shadow-md"
				action={async (formData) => {
					"use server";

					const email = formData.get("email")?.toString();
					const password = formData.get("password")?.toString();

					if (!email || !password) {
						setErrors(["Email and password are required"]);
						return;
					}

					// ✅ Ensure getServerAuthClient() is not null
					const authClient = getServerAuthClient();
					if (!authClient) {
						setErrors(["Authentication client is unavailable."]);
						return;
					}

					const { data } = await authClient.signIn({ email, password }, { cache: "no-store" });

					// ✅ Handle API errors with explicit type for 'error'
					if (data.tokenCreate.errors.length > 0) {
						setErrors(data.tokenCreate.errors.map((error: { message: string }) => error.message));
						setFormValues(DefaultValues); // Reset form
					}
				}}
			>
				{/* Display Errors */}
				{errors.length > 0 && (
					<div className="mb-4 text-red-600">
						{errors.map((error, index) => (
							<p key={index}>{error}</p>
						))}
					</div>
				)}

				{/* Email Field */}
				<div className="mb-2">
					<label className="sr-only" htmlFor="email">
						Email
					</label>
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={formValues.email}
						onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
						className="w-full rounded border bg-neutral-50 px-4 py-2"
					/>
				</div>

				{/* Password Field */}
				<div className="mb-4">
					<label className="sr-only" htmlFor="password">
						Password
					</label>
					<input
						type="password"
						name="password"
						placeholder="Password"
						autoCapitalize="off"
						autoComplete="off"
						value={formValues.password}
						onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
						className="w-full rounded border bg-neutral-50 px-4 py-2"
					/>
				</div>

				{/* Submit Button */}
				<button
					className="rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700"
					type="submit"
				>
					Log In
				</button>
			</form>
		</div>
	);
}
