import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isDraftMode: false,
};

const draftSlice = createSlice({
    name: "draft",
    initialState,
    reducers: {
        enableDraftMode: (state) => {
            state.isDraftMode = true;
            localStorage.setItem("isDraftMode", "true");
        },
        disableDraftMode: (state) => {
            state.isDraftMode = false;
            localStorage.removeItem("isDraftMode");
        },
        checkDraftMode: (state) => {
            state.isDraftMode = localStorage.getItem("isDraftMode") === "true";
        },
    },
});

export const { enableDraftMode, disableDraftMode, checkDraftMode } = draftSlice.actions;
export default draftSlice.reducer;
