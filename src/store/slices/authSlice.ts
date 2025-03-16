import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../../services/authService";

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
    user: User | null;
}

interface User {
    id: number;
    userId: string | null;
    isAuthenticated: boolean;
    full_name: string;
    email: string;
    role: string;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    status: "idle",
    error: null,
    user: null,
};

// ✅ Async Thunk for Login
export const login = createAsyncThunk(
    "auth/login",
    async ({ email, password }: { email: string; password: string }) => {
        const response = await loginUser(email, password);

        if (!response.success) {
            throw new Error(
                response.errors?.map((e: { message: string }) => e.message).join(", ") || "Unknown error"
            );
        }

        return response.token ?? null; // ✅ Ensure token is never `undefined`
    }
);


// ✅ Async Thunk for Logout
export const logout = createAsyncThunk("auth/logout", async () => {
    const response = await logoutUser();

    if (!response.success) {
        throw new Error(response.errors?.map((e) => e.message).join(", ") || "Logout failed");
    }

    return;
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload; // ✅ Always string | null, never undefined
                state.status = "idle";
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Login failed";
            })
            .addCase(logout.pending, (state) => {
                state.status = "loading";
            })
            .addCase(logout.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
                state.status = "idle";
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Logout failed";
            });
    },
});

export default authSlice.reducer;
