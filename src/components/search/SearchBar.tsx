"use client"; // ✅ Add this at the very top

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../../utils/debounce";
import {
  fetchSuggestions,
  executeSearch,
  setFilters,
  executePersonalizedSearch,
  executeCrossModalSearch
} from "../../store/slices/searchSlice";
import { createCrossModalPayload } from "../../utils/CrossModalProcessor";
import StyledSearchBox from "./SearchBoxStyle";
import SearchUploader from "./SearchUploader";
import AdvancedSearchFilters from "./AdvancedSearchFilters";
import SearchSuggestions from "./SearchSuggestions";
import VoiceSearch from "./VoiceSearch";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Menu from "../Menu";
import MenuItem from "../MenuItem";
import TextField from "../text-field/TextField";
import type { AppDispatch, RootState } from "../../store";
import { useMemo } from "react";

type SearchBarProps = {
  channel: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ channel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const searchState = useSelector((state: RootState) => state.search);

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("All Categories");
  const [activeInputType, setActiveInputType] = useState<"text" | "image" | "voice">("text");
  const [filters, setFiltersState] = useState({ region: "US", currency: "USD", language: "en" });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce((query: string) => {
        dispatch(fetchSuggestions({ query, language: filters.language, channel }));
      }, 300),
    [dispatch, filters.language, channel] // ✅ Now correctly memoized
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (value) debouncedFetchSuggestions(value);
  };

  const handleSearch = useCallback(() => {
    const payload = createCrossModalPayload(query, selectedImage);
    dispatch(executeCrossModalSearch(payload));
    dispatch(executeSearch({ query, filters, category, channel }));
    dispatch(
      executePersonalizedSearch({
        query,
        filters,
        userId: String(userId || ""),
        ...(channel ? { channel } : {}),
      })
    );
  }, [dispatch, query, selectedImage, filters, category, channel, userId]);



  const handleImageUpload = (image: File) => {
    setSelectedImage(image);
    dispatch(executeSearch({ query: "", filters, category, channel })); // ✅ Added channel
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch();
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    setFiltersState((prevFilters) => ({
      ...prevFilters,
      ...newFilters, // ✅ Merge new filters correctly
    }));
  };

  return (
    <Box position="relative" flex="1 1 0" maxWidth="800px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">search</Icon>

        {activeInputType === "text" && (
          <TextField
            className="search-field"
            placeholder="Search products..."
            value={query}
            onChange={handleInputChange}
            fullwidth
          />
        )}
        {activeInputType === "image" && <SearchUploader onUpload={handleImageUpload} />}
        {activeInputType === "voice" && <VoiceSearch onTranscript={setQuery} />}

        <Menu
          className="category-dropdown"
          direction="right"
          handler={
            <FlexBox className="dropdown-handler" alignItems="center">
              <span>{category}</span>
              <Icon variant="small">chevron-down</Icon>
            </FlexBox>
          }
        >
          {categories.map((cat) => (
            <MenuItem key={cat} onClick={() => setCategory(cat)}>
              {cat}
            </MenuItem>
          ))}
        </Menu>

        <button className="search-button" onClick={handleSearch}>Search</button>
      </StyledSearchBox>

      <SearchSuggestions query={query} onSuggestionClick={handleSuggestionClick} />

      <FlexBox justifyContent="flex-end" mt="1rem">
        <button onClick={() => setShowFilters((prev) => !prev)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </FlexBox>

      {showFilters && <AdvancedSearchFilters filters={filters} onFilterChange={handleFilterChange} />}

    </Box>
  );
};

const categories = ["All Categories", "Electronics", "Fashion", "Home & Furniture", "Beauty", "Automotive", "Books", "Toys", "Sports"];

export default SearchBar;
