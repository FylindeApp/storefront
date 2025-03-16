import { invariant } from "ts-invariant";
import { type TypedDocumentString } from "../gql/graphql.js";
import { getServerAuthClient } from "../config/config.js";
// import { type TypedDocumentNode } from "@graphql-typed-document-node/core";
import { GraphQLClient } from "graphql-request";
import type { Request } from "express";
import type * as Express from "express"; // ✅ Import Express Namespace

type GraphQLErrorResponse = {
	errors: readonly {
		message: string;
	}[];
};

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://saleor:8000/graphql/';

type GraphQLResponse<T> = { data: T } | GraphQLErrorResponse;

export async function executeGraphQL<Result, Variables>(
	req: Request,
	res: Express.Response, // ✅ Fix Response Type
	operation: TypedDocumentString<Result, Variables>,
	options: {
		variables: Variables;
		headers?: HeadersInit;
		cache?: RequestCache;
		revalidate?: number;
		withAuth?: boolean;
	}
): Promise<Result> {
	invariant(process.env.NEXT_PUBLIC_FYLINDE_API_URL, "Missing NEXT_PUBLIC_FYLINDE_API_URL env variable");

	const { variables, headers, cache, revalidate, withAuth = true } = options;

	const input = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body: JSON.stringify({
			query: operation.toString(),
			variables,
		}),
		cache: cache,
		next: { revalidate },
	};

	const authClient = getServerAuthClient(req, res);
	if (!authClient) {
		throw new Error("Auth client not initialized");
	}

	const response = withAuth
		? await authClient.fetchWithAuth(process.env.NEXT_PUBLIC_FYLINDE_API_URL, input)
		: await fetch(process.env.NEXT_PUBLIC_FYLINDE_API_URL, input);

	if (!response.ok) {
		const bodyText = await response.text();
		console.error(input.body);
		throw new HTTPError(response, bodyText);
	}

	const body = (await response.json()) as GraphQLResponse<Result>;

	if ("errors" in body) {
		throw new GraphQLError(body);
	}

	return body.data;
}

class GraphQLError extends Error {
	constructor(public errorResponse: GraphQLErrorResponse) {
		const message = errorResponse.errors.map((error) => error.message).join("\n");
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

class HTTPError extends Error {
	constructor(response: Response, body: string) {
		const message = `HTTP error ${response.status}: ${response.statusText}\n${body}`;
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
	headers: {
		"Content-Type": "application/json",
	},
});

export default graphqlClient;
