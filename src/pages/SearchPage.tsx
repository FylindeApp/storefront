import React from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import { SearchContainer } from "./SearchPage.styles";

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";

    return (
        <SearchContainer>
            {/* <SearchBar /> */}
            <SearchResults query={query} />
        </SearchContainer>
    );
};

export default SearchPage;
