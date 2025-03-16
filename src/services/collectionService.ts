import { graphqlClient } from "../lib/graphql";
import { gql } from "graphql-request";
import { ProductListByCollectionQuery } from "../gql/graphql";

// Define the GraphQL query manually
const ProductListByCollectionDocument = gql`
    query ProductListByCollection($slug: String!, $channel: String!) {
        collection(slug: $slug, channel: $channel) {
            id
            name
            products {
                id
                name
                slug
                pricing {
                    priceRange {
                        start {
                            gross {
                                amount
                                currency
                            }
                        }
                        stop {
                            gross {
                                amount
                                currency
                            }
                        }
                    }
                }
                category {
                    id
                    name
                }
                thumbnail {
                    url
                    alt
                }
            }
        }
    }
`;

/**
 * Fetch products by collection slug and channel.
 */
export const fetchCollectionProducts = async (slug: string, channel: string) => {
    try {
        // ✅ Use `request()` instead of `query()`
        const response = await graphqlClient.request<ProductListByCollectionQuery>(
            ProductListByCollectionDocument,
            { slug, channel }
        );

        return response.collection; // ✅ Now TypeScript recognizes `collection`
    } catch (error) {
        console.error("Error fetching collection products:", error);
        return null;
    }
};
