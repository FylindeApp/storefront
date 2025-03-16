import { getServerAuthClient } from "../config/config";
import type { Request, Response } from "express"; // ✅ Import Express Types

export const loginUser = async (req: Request, res: Response, email: string, password: string) => {
    try {
        if (!email || !password) throw new Error("Email and password are required");

        const authClient = getServerAuthClient(req, res); // ✅ FIXED: Pass req and res
        if (!authClient) {
            console.error("Login failed: Fylinde Auth Client is not initialized.");
            return { success: false, errors: [{ message: "Login failed: Auth client not available." }] };
        }

        const { data } = await authClient.signIn({ email, password }, { cache: "no-store" });

        if (!data?.tokenCreate) {
            return { success: false, errors: [{ message: "Unexpected API response." }] };
        }

        if (data.tokenCreate.errors.length > 0) {
            return { success: false, errors: data.tokenCreate.errors };
        }

        return { success: true, token: data.tokenCreate.token };
    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, errors: [{ message: error instanceof Error ? error.message : "Unknown error" }] };
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        const authClient = getServerAuthClient(req, res);
        if (!authClient) {
            return { success: false, errors: [{ message: "Logout failed: Auth client not available." }] };
        }

        await authClient.signOut();
        return { success: true };
    } catch (error) {
        console.error("Logout Error:", error);
        return { success: false, errors: [{ message: error instanceof Error ? error.message : "Unknown error" }] };
    }
};
