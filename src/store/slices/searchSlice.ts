import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { executeGraphQL } from "../../services/graphqlService";
import { SearchProductsDocument, SearchProductsQuery, SearchProductsQueryVariables } from "../../gql/graphql";
import searchService from "../../services/searchService";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { ProductOrderField, OrderDirection } from "../../gql/graphql";
import api from "../axiosSetup";



interface ExecuteSearchPayload {
    query: string;
    filters?: any;
    category?: string;
    userId?: string;
    image?: File;
}



interface Suggestion {
    query: string;
    image?: string;
    category?: string;
    price?: number;
    currency?: string;
    cursor?: string;  // ✅ Allow cursor
}

interface Filters {
    categories?: string[];
    brands?: string[];
    priceRange?: { min: number; max: number };
    ratings?: number; // Minimum rating threshold
    region?: string;
    currency?: string;
    language?: string;
}

interface SearchState {
    results: any[];
    totalCount: number | null;
    status: "idle" | "loading" | "failed";
    query: string;
    hasMore: boolean;
    suggestions: Suggestion[];
    filters: Filters;
    availableFilters: Filters;
    isLoading: boolean;
    error: string | null;
    language: string;
    region: string;
    currency: string;
    preferences: any; // New addition
    userId: string | null;
    buyerCurrency: string;
    sellerCurrency: string;
    loading: boolean;
    cursor?: string;  // ✅ Allow cursor
}

const initialState: SearchState = {
    results: [],
    totalCount: null,
    status: "idle",
    query: "",
    suggestions: [],
    filters: {
        region: "US",
        currency: "USD",
        language: "en",
    },
    availableFilters: {},
    hasMore: true,
    isLoading: false,
    error: null,
    language: "en", // Default to English
    region: "US", // Default to US
    currency: "USD", // Default to USD
    preferences: {},
    userId: null, // New addition
    buyerCurrency: 'USD',
    sellerCurrency: 'USD',
    loading: false,
};


export const searchByText = createAsyncThunk(
    "search/searchByText",
    async ({ query, filters }: { query: string; filters?: any }, thunkAPI) => {
        try {
            const results = await searchService.searchByText(query, filters);
            await searchService.logSearchMetrics({ query, filters }); // Log search analytics.
            return results;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Search failed");
        }
    }
);

/**
 * Perform an image-based search.
 */
export const searchByImage = createAsyncThunk(
    "search/searchByImage",
    async (imageData: string, thunkAPI) => {
        try {
            const results = await searchService.searchByImage(imageData);
            return results;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Image search failed");
        }
    }
);

/**
 * Fetch real-time search suggestions.
 */
export const fetchSuggestions = createAsyncThunk(
    "search/fetchSuggestions",
    async ({ query, language, channel }: { query: string; language: string; channel?: string }) => {
        try {
            return await searchService.getSuggestions(query, language); // ✅ Only pass expected arguments
        } catch (err: any) {
            if (channel) {
                console.warn("Ignoring channel since getSuggestions only supports two arguments.");
            }
            return await searchService.getSuggestions(query, language); // ✅ Pass only 2 arguments
        }
    }
);



/**
 * Fetch available filters.
 */
export const fetchAvailableFilters = createAsyncThunk(
    "search/fetchAvailableFilters",
    async (_, thunkAPI) => {
        try {
            const filters = await searchService.getAvailableFilters();
            return filters;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch filters");
        }
    }
);

export const semanticSearch = createAsyncThunk(
    "search/semanticSearch",
    async ({ query, filters, language, currency }: { query: string; filters?: any; language: string; currency: string }, thunkAPI) => {
        try {
            const results = await searchService.semanticSearch(query, filters, language, currency);
            await searchService.logSearchMetrics({ query, filters });
            return results;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Semantic search failed");
        }
    }
);

export const crossModalSearch = createAsyncThunk(
    "search/crossModalSearch",
    async ({ query, imageData }: { query: string; imageData: string }, thunkAPI) => {
        try {
            const results = await searchService.crossModalSearch(query, imageData);
            return results;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Cross-modal search failed");
        }
    }
);

export const visualTryOnSearch = createAsyncThunk(
    "search/visualTryOnSearch",
    async ({ imageData, tryOnType }: { imageData: string; tryOnType: string }, thunkAPI) => {
        try {
            const results = await searchService.visualTryOnSearch(imageData, tryOnType);
            return results;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Visual try-on search failed");
        }
    }
);

export const localizedSearch = createAsyncThunk(
    "search/localizedSearch",
    async ({ query, region, language }: { query: string; region: string; language: string }, thunkAPI) => {
        try {
            const results = await searchService.localizedSearch(query, region, language);
            return results;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Localized search failed");
        }
    }
);

export const executeCrossModalSearch = createAsyncThunk(
    "search/executeCrossModalSearch",
    async (payload: { text: string; image: File | null }, thunkAPI) => {
        try {
            return await searchService.executeCrossModalSearch(payload);
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to execute cross-modal search."
            );
        }
    }
);

// Thunks
export const executePersonalizedSearch = createAsyncThunk(
    "search/executePersonalizedSearch",
    async (
        { query, filters, userId }: { query: string; filters?: any; userId: string },
        thunkAPI
    ) => {
        try {
            return await searchService.executeSearch({ query, filters, userId });
        } catch (err: any) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Personalized search failed."
            );
        }
    }
);

export const executeSearch = createAsyncThunk(
    'search/executeSearch',
    async (
        {
            query,
            filters,
            category,
            userId,
            image,
            channel, // ✅ Add channel here
        }: {
            query: string;
            filters?: any;
            category?: string;
            userId?: string;
            image?: File;
            channel?: string; // ✅ Add channel type definition
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append('query', query);
            if (filters) formData.append('filters', JSON.stringify(filters));
            if (category) formData.append('category', category);
            if (userId) formData.append('userId', userId);
            if (image) formData.append('image', image);
            if (channel) formData.append('channel', channel); // ✅ Add channel

            const response = await api.post('/api/search', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);



export const fetchMoreSearchResults = createAsyncThunk(
    'search/fetchMoreSearchResults',
    async (
        { query, filters, cursor, channel }: { query: string; filters: any; cursor?: string; channel?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await searchService.fetchSearchResults({ query, cursor, channel, filters });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);



export const fetchSearchResults = createAsyncThunk(
    "search/fetchSearchResults",
    async (
        {
            query,
            page = 1, // Default `page` to 1 if undefined
            cursor,
            filters,
            channel = "default-channel", // Default channel if undefined
            useGraphQL = false, // A flag to determine which method to use
        }: {
            query: string;
            page?: number;
            cursor?: string;
            filters?: any;
            channel?: string;
            useGraphQL?: boolean;
        },
        { rejectWithValue }
    ) => {
        try {
            if (useGraphQL) {
                // ✅ Ensure correct type inference for GraphQL execution
                const response = await executeGraphQL<SearchProductsQuery, SearchProductsQueryVariables>(
                    SearchProductsDocument as unknown as TypedDocumentNode<SearchProductsQuery, SearchProductsQueryVariables>,
                    {
                        search: query,
                        sortBy: ProductOrderField.Name,
                        sortDirection: OrderDirection.Asc,
                        first: 10,
                        after: cursor,
                        channel,
                    } // ✅ Pass variables directly (DO NOT wrap in `{ variables: ... }`)
                );


                if (!response || !response.products) {
                    throw new Error("No products found");
                }

                return {
                    results: response.products.edges.map((e) => e.node) || [],
                    totalCount: response.products.totalCount || 0,
                    pageInfo: response.products.pageInfo || {},
                };
            } else {
                // ✅ Use REST API if GraphQL is not enabled
                const response = await searchService.fetchSearchResults({
                    query,
                    page,
                    filters,
                });

                return response;
            }
        } catch (error: any) {
            console.error("Search fetch error:", error);
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);





// Slice
const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setUserId(state, action: PayloadAction<string>) {
            state.userId = action.payload;
        },
        setPreferences(state, action: PayloadAction<any>) {
            state.preferences = action.payload;
        },
        setQuery(state, action: PayloadAction<string>) {
            state.query = action.payload;
        },
        setFilters(state, action: PayloadAction<any>) {
            state.filters = action.payload;
        },
        setLanguage(state, action: PayloadAction<string>) {
            state.language = action.payload;
        },
        setRegion(state, action: PayloadAction<string>) {
            state.region = action.payload;
        },
        setCurrency(state, action: PayloadAction<string>) {
            state.currency = action.payload;
        },
        resetFilters(state) {
            state.filters = {
                region: state.filters.region,
                currency: state.filters.currency,
                language: state.filters.language,
            };
        },

        resetSearch(state) {
            state.query = "";
            state.results = [];
            state.suggestions = [];
            state.filters = {
                region: "US",
                currency: "USD",
                language: "en",
            };
            state.error = null;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMoreSearchResults.fulfilled, (state, action) => {
                state.results = [...state.results, ...action.payload.results];
                state.hasMore = action.payload.hasMore;
            });

        builder
            .addCase(executeSearch.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(executeSearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload;
            })
            .addCase(executeSearch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(executePersonalizedSearch.fulfilled, (state, action) => {
                state.results = action.payload;
            });

        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(semanticSearch.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(semanticSearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload;
            })
            .addCase(semanticSearch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(crossModalSearch.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(crossModalSearch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload;
            })
            .addCase(crossModalSearch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        builder
            .addCase(visualTryOnSearch.fulfilled, (state, action) => {
                state.results = action.payload;
            })
            .addCase(visualTryOnSearch.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        // Handle searchByText
        builder
            .addCase(searchByText.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchByText.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload;
            })
            .addCase(searchByText.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Handle searchByImage
        builder
            .addCase(searchByImage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(searchByImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload;
            })
            .addCase(searchByImage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Handle fetchSuggestions
        builder
            .addCase(fetchSuggestions.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSuggestions.fulfilled, (state, action) => {
                state.suggestions = action.payload; // Ensure payload matches the Suggestion[] type
            })
            .addCase(fetchSuggestions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });


        // Handle fetchAvailableFilters
        builder
            .addCase(fetchAvailableFilters.fulfilled, (state, action) => {
                state.availableFilters = action.payload;
            })
            .addCase(fetchAvailableFilters.rejected, (state, action) => {
                state.error = action.payload as string;
            });
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.status = "idle";
                state.results = action.payload.results;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchSearchResults.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const { setQuery, setUserId, setPreferences, setFilters, setLanguage, setRegion, setCurrency, resetFilters, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;

