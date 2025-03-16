import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCollectionProducts } from "../../services/collectionService";

export interface CollectionState {
    name: string | null;
    products: any[];
    status: "idle" | "loading" | "failed";
}

const initialState: CollectionState = {
    name: null,
    products: [],
    status: "idle",
};

// Async action to fetch collection data
export const fetchCollection = createAsyncThunk(
    "collection/fetchCollection",
    async ({ slug, channel }: { slug: string; channel: string }) => {
        return await fetchCollectionProducts(slug, channel);
    }
);

const collectionSlice = createSlice({
    name: "collection",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollection.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCollection.fulfilled, (state, action) => {
                if (action.payload) {
                    state.name = action.payload.name;

                    // ✅ Ensure `products` is not null before accessing `edges`
                    state.products = action.payload.products?.edges?.map((e: any) => e.node) || [];
                }
                state.status = "idle";
            })

            .addCase(fetchCollection.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export default collectionSlice.reducer;
