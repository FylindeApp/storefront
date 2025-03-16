import { graphqlClient } from "../lib/graphql";
import { gql } from "graphql-request";
import { ProductListByCategoryQuery } from "../gql/graphql";

// Define the GraphQL query manually
const ProductListByCategoryDocument = gql`
    query ProductListByCategory($slug: String!, $channel: String!) {
        category(slug: $slug, channel: $channel) {
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

export const fetchCategoryProducts = async (slug: string, channel: string) => {
    try {
        const response = await graphqlClient.request<ProductListByCategoryQuery>(
            ProductListByCategoryDocument,
            { slug, channel }
        );

        return response.category;  // ✅ Now TypeScript recognizes `category`
    } catch (error) {
        console.error("Error fetching category products:", error);
        return null;
    }
};
