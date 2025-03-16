import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategoryProducts } from "../../services/categoryService";

export interface CategoryState {
    name: string | null;
    products: any[];
    status: "idle" | "loading" | "failed";
}

const initialState: CategoryState = {
    name: null,
    products: [],
    status: "idle",
};

export const fetchCategory = createAsyncThunk(
    "category/fetchCategory",
    async ({ slug, channel }: { slug: string; channel: string }) => {
        return await fetchCategoryProducts(slug, channel);
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategory.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                if (action.payload) {
                    state.name = action.payload.name;

                    // ✅ Safely handle undefined/null products
                    state.products = action.payload.products?.edges
                        ? action.payload.products.edges.map((e: any) => e.node)
                        : [];
                }
                state.status = "idle";
            })
            .addCase(fetchCategory.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export default categorySlice.reducer;
