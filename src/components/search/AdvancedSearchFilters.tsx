import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setFilters, fetchSearchResults } from "../../store/slices/searchSlice";
import { debounce } from "../../utils/debounce";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Slider from "@mui/material/Slider";
import CheckBox from "../CheckBox";
import { Button } from "../checkout";
import StyledFilters from "./StyledFilters";
import type { AppDispatch } from "../../store";
import { useMemo } from "react";


interface AdvancedSearchFiltersProps {
  filters: Record<string, any>;
  onFilterChange: (newFilters: Record<string, any>) => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({ filters, onFilterChange }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [priceRange, setPriceRange] = useState<[number, number]>(filters?.priceRange || [0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters?.categories || []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(filters?.brands || []);
  const [selectedRatings, setSelectedRatings] = useState<number | null>(filters?.ratings || null);

  const categories = ["Electronics", "Fashion", "Home", "Automotive", "Books"];
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];
  const ratings = [5, 4, 3, 2, 1];

  const updateFilters = useMemo(
    () =>
      debounce((newFilters: Record<string, any>) => {
        dispatch(setFilters(newFilters));
        dispatch(fetchSearchResults({ query: "", page: 1, filters: newFilters }));
        onFilterChange(newFilters);
      }, 300),
    [dispatch, onFilterChange] // ✅ Now correctly memoized
  );

  const handlePriceChange = (_event: Event, value: number | number[]) => {
    const range = value as [number, number];
    setPriceRange(range);
    updateFilters({ priceRange: range });
  };

  const toggleCategory = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
    updateFilters({ categories: updatedCategories });
  };

  const toggleBrand = (brand: string) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updatedBrands);
    updateFilters({ brands: updatedBrands });
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(rating);
    updateFilters({ ratings: rating });
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRatings(null);
    dispatch(setFilters({})); // ✅ Corrected
    dispatch(fetchSearchResults({ query: "", page: 1, filters: {} })); // ✅ Corrected
  };


  return (
    <StyledFilters>
      <FlexBox flexDirection="column" p="1rem" gap="1rem">
        <Box>
          <h4>Price Range</h4>
          <Slider min={0} max={5000} step={50} value={priceRange} onChange={handlePriceChange} valueLabelDisplay="auto" />
          <p>${priceRange[0]} - ${priceRange[1]}</p>
        </Box>

        <Box>
          <h4>Categories</h4>
          {categories.map((category) => (
            <CheckBox key={category} label={category} checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} />
          ))}
        </Box>

        <Box>
          <h4>Brands</h4>
          {brands.map((brand) => (
            <CheckBox key={brand} label={brand} checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
          ))}
        </Box>

        <Box>
          <h4>Ratings</h4>
          {ratings.map((rating) => (
            <Button key={rating} variant={selectedRatings === rating ? "primary" : "secondary"} onClick={() => handleRatingChange(rating)}>
              {rating} Stars
            </Button>
          ))}
        </Box>

        <Button variant="primary" onClick={clearFilters}>Clear All Filters</Button>
      </FlexBox>
    </StyledFilters>
  );
};

export default AdvancedSearchFilters;
