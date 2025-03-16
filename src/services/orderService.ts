import { graphqlClient } from "../lib/graphql";
import { gql } from "graphql-request";
import { CurrentUserOrderListQuery } from "../gql/graphql";

// Define the GraphQL query manually
const CurrentUserOrderListDocument = gql`
    query CurrentUserOrderList {
        me {
            id
            email
            orders(first: 10) {
                edges {
                    node {
                        id
                        created
                        status
                        total {
                            gross {
                                amount
                                currency
                            }
                        }
                    }
                }
            }
        }
    }
`;

/**
 * Fetches the current user's orders.
 */
export const fetchUserOrders = async () => {
    try {
        // ✅ Use `request()` instead of `query()`
        const response = await graphqlClient.request<CurrentUserOrderListQuery>(
            CurrentUserOrderListDocument
        );

        return response.me; // ✅ Now TypeScript recognizes `me`
    } catch (error) {
        console.error("Error fetching orders:", error);
        return null;
    }
};
