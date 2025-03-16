import { useDispatch } from "react-redux";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { TrashIcon } from "../../icons";
import { deleteAddress, saveAddress } from "../../../store/action/addressActions";
import { AddressService } from "../../../services/addressService"; // Service Layer

interface AddressFormActionsProps {
	addressId?: string;
	onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void; 
	onCancel: () => void;
	loading: boolean;
	onDelete?: () => void;
}

export const AddressFormActions: React.FC<AddressFormActionsProps> = ({
	addressId,
	onSubmit,
	loading,
	onCancel,
	onDelete
}) => {
	const dispatch = useDispatch();
	// ✅ Handle address deletion
	const handleDelete = async () => {
		if (!addressId) return;
		try {
			await AddressService.deleteAddress(addressId); // Call service layer
			dispatch(deleteAddress(addressId)); // Dispatch Redux action
			if (onDelete) {
				onDelete(); // ✅ Call the onDelete prop if provided
			}
		} catch (error) {
			console.error("Failed to delete address:", error);
		}
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement; // ✅ Explicitly cast to HTMLFormElement
		try {
			dispatch(saveAddress());
			onSubmit(e as React.FormEvent<HTMLFormElement>); // ✅ Type assertion
		} catch (error) {
			console.error("Failed to save address:", error);
		}
	};



	return (
		<div className="flex flex-row justify-end gap-2">
			{addressId && (
				<div className="flex">
					<IconButton ariaLabel="Delete address" onClick={handleDelete} icon={<TrashIcon aria-hidden />} />
				</div>
			)}
			<Button
				ariaLabel="Cancel editing"
				variant="secondary"
				onClick={onCancel}
			>
				Cancel
			</Button>

			<Button
				ariaLabel="Save address"
				onClick={!loading ? handleSave : undefined}
				disabled={loading}
			>
				{loading ? "Processing…" : "Save address"}
			</Button>

		</div>
	);
};
