import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

// Define the Channel Type
interface Channel {
    id: string;
    name: string;
}

interface ChannelState {
    channels: Channel[];
    currentChannel: string; // Stores the active channel ID or name
    loading: boolean;
    error: string | null;
}

// ✅ Initial State
const initialState: ChannelState = {
    channels: [],
    currentChannel: "default-channel",
    loading: false,
    error: null,
};

// ✅ Async Thunk to Fetch Channels from API
export const fetchChannels = createAsyncThunk<Channel[], void, { rejectValue: string }>(
    "channels/fetchChannels",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/channels"); // Replace with actual API
            if (!response.ok) throw new Error("Failed to fetch channels");

            const data = (await response.json()) as Channel[]; // ✅ Explicit type assertion
            return data;
        } catch (error) {
            return rejectWithValue((error as Error).message); // ✅ Cast error properly
        }
    }
);


// ✅ Channel Slice
const channelSlice = createSlice({
    name: "channel",
    initialState,
    reducers: {
        // ✅ Set the Current Channel
        setCurrentChannel: (state, action: PayloadAction<string>) => {
            state.currentChannel = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChannels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChannels.fulfilled, (state, action) => {
                state.loading = false;
                state.channels = action.payload;
                if (action.payload.length > 0) {
                    state.currentChannel = action.payload[0].id; // Default to the first channel
                }
            })
            .addCase(fetchChannels.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === "string" ? action.payload : "Unknown error occurred"; // ✅ Ensure correct type
            });
    },
});

// ✅ Export Actions & Selectors
export const { setCurrentChannel } = channelSlice.actions;

// Selector to get current channel
export const selectCurrentChannel = (state: RootState) => state.channel.currentChannel;

// Selector to get all channels
export const selectChannels = (state: RootState) => state.channel.channels;

export default channelSlice.reducer;
