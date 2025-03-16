import { type FC } from "react";
import { type Money as MoneyType, getFormattedMoney } from "./lib/utils/money";
import { type AriaLabel, type Classes } from "./lib/globalTypes";

export interface MoneyProps<TMoney extends MoneyType = MoneyType> extends Classes, AriaLabel {
	money?: TMoney; // ✅ Optional MoneyType
	negative?: boolean;
}

export const Money: FC<MoneyProps> = ({
	money,
	className = "",
	ariaLabel,
	negative = false,
	...textProps
}) => {
	if (!money) {
		return <p className={className} aria-label="Price unavailable">N/A</p>; // ✅ Fallback for missing money
	}

	return (
		<p {...textProps} aria-label={ariaLabel} className={className}>
			{getFormattedMoney(money, negative)}
		</p>
	);
};
