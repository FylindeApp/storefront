import { CheckoutDeleteLinesDocument } from "../gql/graphql";
import { graphqlClient } from "../lib/graphql";
import { RequestDocument } from "graphql-request";

/**
 * Remove an item from the checkout/cart.
 */
export const deleteLineFromCheckout = async (lineId: string, checkoutId: string): Promise<void> => {
    try {
        await graphqlClient.request(CheckoutDeleteLinesDocument as unknown as RequestDocument, {
            checkoutId,
            lineIds: Array.isArray(lineId) ? lineId : [lineId], // ✅ Ensure `lineIds` is always an array
        });
    } catch (error) {
        console.error("Error deleting checkout line:", error);
        throw error;
    }
};
