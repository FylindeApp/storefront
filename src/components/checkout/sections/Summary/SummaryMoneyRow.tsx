import React, { type PropsWithChildren } from "react";
import { Money, type MoneyProps } from "../../Money";

export interface SummaryMoneyRowProps extends Omit<MoneyProps, "ariaLabel"> {
	label: string;
	ariaLabel?: string; // ✅ Ensure it's optional
}

export const SummaryMoneyRow: React.FC<PropsWithChildren<SummaryMoneyRowProps>> = ({
	label,
	ariaLabel = label, // ✅ Default `ariaLabel` to `label` if not provided
	children,
	...moneyProps
}) => {
	return (
		<div
			className="mb-2 flex flex-row items-center justify-between"
			aria-label={ariaLabel} // ✅ Always provide a fallback
		>
			<div className="flex flex-row items-center">
				<p color="secondary">{label}</p>
				{children}
			</div>
			<Money {...moneyProps} ariaLabel={ariaLabel} /> {/* ✅ Pass ariaLabel to Money */}
		</div>
	);
};
