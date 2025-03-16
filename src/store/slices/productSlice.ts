import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductDetails, fetchPaginatedProducts, fetchFeaturedProductsAPI } from "../../services/productService";
import { Product } from "../../types/Product";
import { ProductListItemFragment } from "../../gql/graphql";


interface ProductState {
    currentProduct: any | null;
    featuredProducts: ProductListItemFragment[]; 
    products: Product[];
    status: "idle" | "loading" | "failed";
}

const initialState: ProductState = {
    currentProduct: null,
    featuredProducts: [],
    products: [],
    status: "idle",
};

// Fetch single product
export const fetchProduct = createAsyncThunk(
    "products/fetchProduct",
    async ({ slug, channel }: { slug: string; channel: string }) => {
        return await fetchProductDetails(slug, channel);
    }
);

// Fetch paginated products
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async ({ channel, cursor }: { channel: string; cursor?: string }) => {
        return await fetchPaginatedProducts(channel, cursor);
    }
);

// Fetch Featured Products
export const fetchFeaturedProducts = createAsyncThunk(
    "products/fetchFeaturedProducts",
    async () => {
        const products = await fetchFeaturedProductsAPI(); // ✅ API already returns an array
        return products.map((product: any) => ({
            __typename: "Product",
            id: product.id,
            name: product.name,
            slug: product.slug,

            // ✅ Pricing structure
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

            // ✅ Category structure
            category: product.category
                ? {
                    __typename: "Category",
                    id: product.category.id,
                    name: product.category.name,
                }
                : null,

            // ✅ Thumbnail structure
            thumbnail: product.thumbnail
                ? {
                    __typename: "Image",
                    url: product.thumbnail.url,
                    alt: product.thumbnail.alt || null,
                }
                : null,
        })) as ProductListItemFragment[];
    }
);



const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProduct.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.currentProduct = action.payload;
                state.status = "idle";
            })
            .addCase(fetchProduct.rejected, (state) => {
                state.status = "failed";
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                if (action.payload) {
                    state.currentProduct = action.payload; // ✅ Only assign if payload exists
                }
                state.status = "idle";
            })
        builder
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.status = "idle";
                state.featuredProducts = action.payload; // ✅ Already correct
            })
            .addCase(fetchFeaturedProducts.rejected, (state) => {
                state.status = "failed";
            });


    },
});

export default productSlice.reducer;
