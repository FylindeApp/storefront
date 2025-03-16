import { createFylindeAuthClient } from "@fylinde/auth-sdk/dist";
import { getServerCookiesStorage } from "@fylinde/auth-sdk/dist/next/server";
import { invariant } from "ts-invariant";
import type { Request } from "express";
import type * as Express from "express"; // ✅ Import Express Namespace

export const PRODUCTS_PER_PAGE: number = 12;

const fylindeApiUrl: string | undefined = process.env.NEXT_PUBLIC_FYLINDE_API_URL;

try {
	invariant(fylindeApiUrl, "❌ Missing NEXT_PUBLIC_FYLINDE_API_URL env variable");
} catch (error) {
	console.error(error);
}

export const getServerAuthClient = (req: Request, res: Express.Response) => { // ✅ Fix Response Type
	if (!fylindeApiUrl) {
		console.error("❌ Fylinde API URL is missing! Authentication client cannot be created.");
		return null;
	}

	const nextServerCookiesStorage = getServerCookiesStorage(req, res);

	try {
		return createFylindeAuthClient({
			fylindeApiUrl,
			refreshTokenStorage: nextServerCookiesStorage,
			accessTokenStorage: nextServerCookiesStorage,
		});
	} catch (error) {
		console.error("❌ Failed to create Fylinde Auth Client:", error);
		return null;
	}
};
