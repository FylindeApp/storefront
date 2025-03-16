"use client";

import { FylindeAuthProvider , useAuthChange } from "@fylinde/auth-sdk/dist/react";
import { invariant } from "ts-invariant";
import { createFylindeAuthClient  } from "@fylinde/auth-sdk/dist";
import { useState, type ReactNode } from "react";
import {
	type Client,
	Provider as UrqlProvider,
	cacheExchange,
	createClient,
	debugExchange,
	fetchExchange,
} from "urql";

const fylindeApiUrl = process.env.NEXT_PUBLIC_FYLINDE_API_URL;
invariant(fylindeApiUrl, "Missing NEXT_PUBLIC_FYLINDE_API_URL env variable");

export const fylindeAuthClient = createFylindeAuthClient({
	fylindeApiUrl,
});

const makeUrqlClient = () => {
	return createClient({
		url: fylindeApiUrl,
		suspense: true,
		// requestPolicy: "cache-first",
		fetch: (input, init) => fylindeAuthClient.fetchWithAuth(input as NodeJS.fetch.RequestInfo, init),
		exchanges: [debugExchange, cacheExchange, fetchExchange],
	});
};

export function AuthProvider({ children }: { children: ReactNode }) {
	invariant(fylindeApiUrl, "Missing NEXT_PUBLIC_FYLINDE_API_URL env variable");

	const [urqlClient, setUrqlClient] = useState<Client>(() => makeUrqlClient());
	useAuthChange({
		fylindeApiUrl,
		onSignedOut: () => {
			setUrqlClient(makeUrqlClient());
		},
		onSignedIn: () => {
			setUrqlClient(makeUrqlClient());
		},
	});

	return (
		<FylindeAuthProvider client={fylindeAuthClient}>
			<UrqlProvider value={urqlClient}>{children}</UrqlProvider>
		</FylindeAuthProvider>
	);
}
