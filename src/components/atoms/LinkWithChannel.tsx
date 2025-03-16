import React from "react";
import { Link, useParams } from "react-router-dom"; // ✅ Use React Router instead of Next.js
import { type ComponentProps } from "react";

// ✅ Correctly define Params with an index signature
interface Params extends Record<string, string | undefined> {
	channel?: string;
}

export const LinkWithChannel: React.FC<
	Omit<ComponentProps<typeof Link>, "to"> & { to: string }
> = ({ to, ...props }) => {
	const params = useParams<Params>(); // ✅ Type-safe dynamic params
	const channel = params.channel ?? ""; // ✅ Ensure a safe default

	if (!to.startsWith("/")) {
		return <Link {...props} to={to} />;
	}

	const encodedChannel = encodeURIComponent(channel);
	const toWithChannel = `/${encodedChannel}${to}`;

	return <Link {...props} to={toWithChannel} />;
};
