import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { useAuthChange } from "@fylinde/auth-sdk/dist/react";
import { Provider as UrqlProvider, createClient, cacheExchange, fetchExchange, type  Client  } from "urql";
import { ErrorBoundary } from "react-error-boundary";
import { alertsContainerProps } from "./components/checkout/hooks/useAlerts/consts.js";
import { RootViews } from "./components/checkout/views/RootViews.jsx";
import { PageNotFound } from "./components/checkout/views/PageNotFound/PageNotFound.jsx";
//import "./index.css";

type AppProps = {
    fylindeApiUrl?: string; // ✅ Make optional if not always needed
};

export default function App({ fylindeApiUrl }: AppProps) {
    // ✅ Use `fylindeApiUrl` or fallback to default
    const apiUrl = fylindeApiUrl || process.env.NEXT_PUBLIC_FYLINDE_API_URL || "https://your-api-url/graphql";

    // ✅ Custom Fetch Function (Fixes TypeScript Issues)
    const customFetch: typeof fetch = async (input, init) => {
        if (typeof input !== "string" && !(input instanceof Request) && !(input instanceof URL)) {
            throw new TypeError("Invalid fetch input");
        }
        return fetch(input, {
            ...init,
            ...(typeof window === "undefined"
                ? { headers: { ...init?.headers, Connection: "keep-alive" } }
                : {}),
        });
    };

    // ✅ Create GraphQL Client (Urql)
    const makeUrqlClient = () =>
        createClient({
            url: apiUrl, // ✅ Now uses dynamic API URL
            suspense: true,
            requestPolicy: "cache-first",
            fetch: customFetch,
            exchanges: [cacheExchange, fetchExchange],
        });

    const [urqlClient, setUrqlClient] = useState<Client>(makeUrqlClient());

    useAuthChange({
        fylindeApiUrl: apiUrl, // ✅ Use dynamic API URL
        onSignedOut: () => setUrqlClient(makeUrqlClient()),
        onSignedIn: () => setUrqlClient(makeUrqlClient()),
    });

    return (
        <UrqlProvider value={urqlClient}>
            <ToastContainer {...alertsContainerProps} />
            <ErrorBoundary FallbackComponent={PageNotFound}>
                <RootViews />
            </ErrorBoundary>
        </UrqlProvider>
    );
}
