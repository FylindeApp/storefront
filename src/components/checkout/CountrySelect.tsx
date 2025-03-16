import React, { useMemo } from "react";
import { Select } from "./Select";
import { type CountryCode } from "./graphql"; // Ensure this import is correct
import { countries as allCountries } from "./lib/consts/countries";
import { getCountryName } from "./lib/utils/locale";

interface CountrySelectProps {
	only?: CountryCode[]; // ✅ Explicitly mark `only` as optional
	value?: CountryCode;
	onChange: (value: CountryCode) => void;
	onBlur?: () => void;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ only, value, onChange, onBlur }) => {
	// ✅ Memoize the country list to prevent unnecessary recalculations
	const countryOptions = useMemo(() => {
		const countriesToMap = only && only.length ? only : allCountries;
		return countriesToMap.map((countryCode) => ({
			value: countryCode,
			label: getCountryName(countryCode),
		}));
	}, [only]); // ✅ `only` is now properly passed

	return (
		<Select
			name="countryCode"
			label="Country"
			options={countryOptions} // ✅ Fix: Use computed `countryOptions`
			autoComplete="country"
			aria-label="Select your country" // ✅ Improved accessibility
			value={value} // ✅ Ensure controlled component
			onChange={(e) => onChange(e.target.value as CountryCode)} // ✅ Ensure correct type
			onBlur={onBlur} // ✅ Attach `onBlur` event
		/>
	);
};
