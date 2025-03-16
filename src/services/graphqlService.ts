import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { TypedDocumentString } from "../gql/graphql";
import { request, GraphQLClient, Variables } from "graphql-request"; // Ensure `graphql-request` is installed
import { print } from "graphql"; // ✅ Import `print` from `graphql`
import { type RequestDocument } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || "https://your-api-url/graphql"; // ✅ Set your API URL here


// Create a GraphQL Client
const client = new GraphQLClient(GRAPHQL_ENDPOINT);


interface GraphQLResponse<T> {
    data?: T;
    errors?: { message: string }[];
}

/**
 * Executes a GraphQL query/mutation using a **typed** GraphQL document.
 *
 * @param document - The GraphQL query/mutation document.
 * @param variables - (Optional) The variables object.
 * @param withAuth - (Optional) If true, includes an Authorization header.
 * @returns The GraphQL response.
 */
// Overload when there are NO variables
export async function executeGraphQL<TData>(
    document: TypedDocumentNode<TData, Record<string, never>>,
    withAuth?: boolean
): Promise<TData>;

// Overload when variables are passed
export async function executeGraphQL<TData, V extends Record<string, any>>(
    document: TypedDocumentNode<TData, V>,
    variables: V,
    withAuth?: boolean
): Promise<TData>;

// Main function implementation
// export async function executeGraphQL<TData, V extends Record<string, any> = Record<string, never>>(
//     document: TypedDocumentNode<TData, V> | TypedDocumentString<TData, V>,
//     variables?: V,
//     withAuth: boolean = false
// ): Promise<TData> {
//     try {
//         const headers: Record<string, string> = {
//             "Content-Type": "application/json",
//         };

//         if (withAuth) {
//             const token = localStorage.getItem("authToken");
//             if (token) {
//                 headers["Authorization"] = `Bearer ${token}`;
//             }
//         }

//         client.setHeaders(headers);

//         // ✅ Fix: Ensure correct conversion of document
//         const formattedDocument: RequestDocument =
//             "kind" in document ? document : print(document as any);

//         // ✅ Fix: Ensure variables are always an object
//         const safeVariables = (variables ?? {}) as V;

//         return await client.request<TData, V>(formattedDocument, safeVariables);
        
//     } catch (error) {
//         console.error("GraphQL Execution Error:", error);
//         throw new Error("Failed to fetch data from GraphQL API.");
//     }
// }



export async function executeGraphQL<TData, V extends Record<string, any> = Record<string, never>>(
    document: TypedDocumentNode<TData, V> | TypedDocumentString<TData, V>,
    variables?: V,
    withAuth: boolean = false
): Promise<TData> {
    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (withAuth) {
            const token = localStorage.getItem("authToken");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }

        client.setHeaders(headers);

        // ❌ Commenting out the actual request to avoid breaking the app
        // return await client.request<TData, V>(formattedDocument, safeVariables);

        // ✅ Temporary Mock Response (Replace with something meaningful)
        return Promise.resolve({} as TData);

    } catch (error) {
        console.error("GraphQL Execution Error:", error);
        throw new Error("Failed to fetch data from GraphQL API.");
    }
}

