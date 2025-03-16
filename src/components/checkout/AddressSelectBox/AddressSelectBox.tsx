import React from "react";
import { SelectBox, type SelectBoxProps } from "../SelectBox";
import { Button } from "../Button";
import { Address } from "../Address";
import { type AddressFragment } from "../graphql";
import { AddressField } from "../AddressForm/address/types";
import { EditIcon } from "../../icons";

interface AddressSelectBoxProps<TFieldName extends string>
	extends Omit<SelectBoxProps<TFieldName>, "children"> {
	address: Partial<Record<AddressField, any>>;
	onEdit: () => void;
	unavailable: boolean;
}

export const AddressSelectBox = <TFieldName extends string>({
	address,
	onEdit,
	unavailable,
	...rest
}: AddressSelectBoxProps<TFieldName>) => {
	return (
		<SelectBox {...rest} disabled={unavailable}>
			<div className="flex w-full flex-col justify-between pe-8">
				<Address address={address as AddressFragment}>
					{unavailable && <p className="font-xs my-1">Can&apos;t ship to this address</p>}
				</Address>
				<Button
					variant="tertiary"
					onClick={(event) => {
						event.stopPropagation();
						onEdit();
					}}
					ariaLabel="edit"
					className="s pointer-events-auto absolute right-2 top-2 h-6 w-6 p-0"
				>
					<EditIcon />
				</Button>

			</div>
		</SelectBox>
	);
};
