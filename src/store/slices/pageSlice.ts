import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPageBySlug } from "../../services/pageService";

interface PageState {
    title: string | null;
    content: string | null;
    status: "idle" | "loading" | "failed";
}

const initialState: PageState = {
    title: null,
    content: null,
    status: "idle",
};

// Async action to fetch page data
export const fetchPage = createAsyncThunk("page/fetchPage", async ({ slug }: { slug: string}) => {
    return await fetchPageBySlug(slug);
});

const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPage.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchPage.fulfilled, (state, action) => {
                if (action.payload) {
                    state.title = action.payload.title ?? null;   // ✅ Ensure it's either a string or null
                    state.content = action.payload.content ?? null; // ✅ Convert undefined to null
                }
                state.status = "idle";
            })

            .addCase(fetchPage.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export default pageSlice.reducer;
