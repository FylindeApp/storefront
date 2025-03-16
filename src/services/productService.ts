import { executeGraphQL } from "../lib/graphql";
import { ProductDetailsDocument, ProductListPaginatedDocument } from "../gql/graphql";
import api from "../store/axiosSetup";
import { ProductListItemFragment } from "../gql/graphql";


export const fetchProductDetails = async (slug: string, channel: string) => {
    try {
        const { product } = await executeGraphQL(ProductDetailsDocument, {
            variables: { slug, channel },
            revalidate: 60,
        });

        return product;
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
};

export const fetchPaginatedProducts = async (channel: string, cursor?: string) => {
    try {
        const { products } = await executeGraphQL(ProductListPaginatedDocument, {
            variables: { first: 20, after: cursor, channel },
            revalidate: 60,
        });

        return products;
    } catch (error) {
        console.error("Error fetching paginated products:", error);
        return null;
    }
};



export const fetchFeaturedProductsAPI = async (): Promise<ProductListItemFragment[]> => {
    const response = await api.get<ProductListItemFragment[]>("/api/products/featured");

    return response.data.map((product: any) => ({
        __typename: "Product",
        id: product.id,
        name: product.name,
        slug: product.slug,

        // ✅ Ensure pricing follows the correct structure
        pricing: product.price
            ? {
                __typename: "ProductPricingInfo",
                priceRange: {
                    __typename: "TaxedMoneyRange",
                    start: {
                        __typename: "TaxedMoney",
                        gross: {
                            __typename: "Money",
                            amount: product.price,
                            currency: product.currency || "USD",
                        },
                    },
                    stop: {
                        __typename: "TaxedMoney",
                        gross: {
                            __typename: "Money",
                            amount: product.price,
                            currency: product.currency || "USD",
                        },
                    },
                },
            }
            : null,

        // ✅ Ensure category follows the correct structure
        category: product.category
            ? {
                __typename: "Category",
                id: product.category.id,
                name: product.category.name,
            }
            : null,

        // ✅ Ensure thumbnail follows the correct structure
        thumbnail: product.thumbnail
            ? {
                __typename: "Image",
                url: product.thumbnail.url,
                alt: product.thumbnail.alt || null,
            }
            : null,
    }));
};
