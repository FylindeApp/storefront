/// <reference lib="dom" />

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchResults, fetchMoreSearchResults } from "../../store/slices/searchSlice";
import { useInView } from "react-intersection-observer";
import { ProductList } from "../ProductList";
import RecommendedItems from "./RecommendedItems";
import ARViewer from "./ARViewer";
import type { AppDispatch, RootState } from "../../store";

interface SearchResultsProps {
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { results, totalCount, status, hasMore } = useSelector((state: RootState) => state.search);
  const [arProduct, setArProduct] = useState<string | null>(null);
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchResults({ query, cursor: undefined, channel: "default-channel" }));
    }
  }, [dispatch, query]);

  useEffect(() => {
    if (inView && hasMore && status !== "loading") {
      dispatch(fetchMoreSearchResults({ query, filters: {}, channel: "default-channel" }));
    }
  }, [dispatch, inView, hasMore, status, query]);



  return (
    <>
      {(totalCount ?? 0) > 0 ? (  // ✅ Convert null to 0
        <>
          <h1>Search results for "{query}"</h1>
          <ProductList products={results} />
          <div ref={ref} />
        </>
      ) : (
        <h1>No results found :(</h1>
      )}


      {arProduct && <ARViewer productId={arProduct} />}
      <RecommendedItems context="search" query={query} />
    </>
  );
};

export default SearchResults;
