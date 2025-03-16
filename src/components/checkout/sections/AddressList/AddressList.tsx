import React from "react";
import { camelCase } from "lodash-es";
import { AddressSelectBox } from "../../AddressSelectBox";
import { type AddressFragment } from "../../../../components/checkout/graphql";
import { SelectBoxGroup } from "../../SelectBoxGroup";
import { useAddressAvailability } from "../../hooks/useAddressAvailability";
import { Button } from "../../Button";
import { Title } from "../../Title";
import { type UseFormReturn } from "../../hooks/useForm";
import { type AddressListFormData } from "../../../../components/checkout/sections/AddressList/useAddressListForm";
import { FormProvider } from "../../hooks/useForm/FormProvider";

export interface AddressListProps {
	onEditChange: (id: string) => void;
	onAddAddressClick: () => void;
	checkAddressAvailability?: boolean;
	title: string;
	form: UseFormReturn<AddressListFormData>;
}

export const AddressList: React.FC<AddressListProps> = ({
	onEditChange,
	checkAddressAvailability = false,
	title,
	onAddAddressClick,
	form,
}) => {
	const {
		values: { addressList },
	} = form;

	const { isAvailable } = useAddressAvailability(!checkAddressAvailability);

	return (
		<FormProvider form={form}>
			<div className="flex flex-col">
				<Title>{title}</Title>
				{addressList.length < 1 && <p className="mb-3">You currently have no saved addresses.</p>}

				<Button
					variant="secondary"
					ariaLabel="add address"
					onClick={onAddAddressClick}
					className="w-full"
				>
					Add address
				</Button>

				<SelectBoxGroup label="user addresses">
					{addressList.map(({ id, ...rest }: AddressFragment) => {
						const identifier = `${camelCase(title)}-${id}`;

						return (
							<AddressSelectBox
								name="selectedAddressId"
								id={identifier}
								key={identifier}
								value={id}
								address={{ ...rest }}
								onEdit={() => onEditChange(id)}
								unavailable={!isAvailable(rest)}
							/>
						);
					})}
				</SelectBoxGroup>
			</div>
		</FormProvider>
	);

};
