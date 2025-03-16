import { useMemo } from "react";
import { type CheckoutLineFragment } from "../../graphql";
import { TextInput } from "../../TextInput";
import { Skeleton } from "../../Skeleton";
import { SummaryItemMoneyInfo } from "./SummaryItemMoneyInfo";
import { FormProvider } from "../../hooks/useForm/FormProvider";
import { useSummaryItemForm } from "./useSummaryItemForm";

interface SummaryItemMoneyEditableSectionProps {
	line: CheckoutLineFragment;
}

export const SummaryItemMoneyEditableSection: React.FC<SummaryItemMoneyEditableSectionProps> = ({ line }) => {
	const { form, onLineDelete } = useSummaryItemForm({ line });

	const {
		handleBlur,
		handleChange,
		setFieldValue,
		handleSubmit,
		isSubmitting,
		values: { quantity: quantityString },
	} = form;

	const quantity = useMemo(() => parseInt(quantityString), [quantityString]);

	const handleQuantityInputBlur = (event: React.FocusEvent<any, Element>) => {
		handleBlur(event);

		if (quantity === line.quantity) {
			return;
		}

		const isQuantityValid = !Number.isNaN(quantity) && quantity >= 0;

		if (quantityString === "" || !isQuantityValid) {
			void setFieldValue("quantity", String(line.quantity));
			return;
		}

		if (quantity === 0) {
			void onLineDelete();
			return;
		}

		void handleSubmit();
	};

	return (
		<div className="flex flex-col items-end gap-2">
			<FormProvider form={form}>
				<TextInput
					required
					onChange={handleChange}
					onBlur={handleQuantityInputBlur}
					name="quantity"
					label="Quantity"
					className="max-w-[6ch] text-center"
				/>
			</FormProvider>
			{isSubmitting ? (
				<div className="flex max-w-[6ch] flex-col">
					<Skeleton />
					<Skeleton />
				</div>
			) : (
				<SummaryItemMoneyInfo {...line} />
			)}
		</div>
	);
};
