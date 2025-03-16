import { Request, Response } from "express";
import { CheckoutCreateDocument, CheckoutFindDocument } from "../gql/graphql.js";
import { executeGraphQL } from "../lib/graphql.js";

export function getIdFromCookies(req: Request, channel: string) {
	const cookieName = `checkoutId-${channel}`;
	return req.cookies[cookieName] || "";
}

export function saveIdToCookie(res: Response, channel: string, checkoutId: string) {
	const shouldUseHttps =
		process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;
	const cookieName = `checkoutId-${channel}`;
	res.cookie(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
		httpOnly: true
	});
}

// ✅ FIX: Pass req, res into executeGraphQL
export async function find(req: Request, res: Response, checkoutId: string) {
	try {
		// ✅ Ensure checkout object is destructured correctly
		const response = checkoutId
			? await executeGraphQL(req, res, CheckoutFindDocument, {
				variables: {
					id: checkoutId
				},
				cache: "no-cache"
			})
			: null;

		return response?.checkout || null;
	} catch {
		// We ignore invalid ID or checkout not found
		return null;
	}
}

// ✅ FIX: Pass req, res into executeGraphQL
export async function findOrCreate(req: Request, res: Response, {
	channel,
	checkoutId
}: {
	checkoutId?: string;
	channel: string;
}) {
	if (!checkoutId) {
		const createdCheckout = await create(req, res, { channel });
		return createdCheckout?.checkoutCreate?.checkout;
	}
	const checkout = await find(req, res, checkoutId);
	return checkout || (await create(req, res, { channel }))?.checkoutCreate?.checkout;
}

// ✅ FIX: Pass req, res into executeGraphQL
export const create = (req: Request, res: Response, { channel }: { channel: string }) =>
	executeGraphQL(req, res, CheckoutCreateDocument, {
		cache: "no-cache",
		variables: { channel }
	});
