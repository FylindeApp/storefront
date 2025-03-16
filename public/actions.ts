"use server";

import { getServerAuthClient } from "@/config/config";

export async function logout() {
	"use server";

	const authClient = getServerAuthClient();

	if (!authClient) {
		console.error("Auth client is null. Cannot sign out.");
		return;
	}

	authClient.signOut();
}
