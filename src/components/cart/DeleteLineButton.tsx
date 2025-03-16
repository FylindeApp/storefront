import React, { useState } from "react";
import { deleteLineFromCheckout } from "../../services/cartService";
import { DeleteButton } from "./DeleteLineButton.styles";

type Props = {
	lineId: string;
	checkoutId: string;
	onDelete?: (lineId: string) => void; // Callback for parent to update UI
};

export const DeleteLineButton: React.FC<Props> = ({ lineId, checkoutId, onDelete }) => {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (isDeleting) return;
		setIsDeleting(true);
		try {
			await deleteLineFromCheckout(lineId, checkoutId);
			if (onDelete) onDelete(lineId); // Notify parent to update UI
		} catch (error) {
			console.error("Failed to delete item:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<DeleteButton onClick={handleDelete} disabled={isDeleting}>
			{isDeleting ? "Removing..." : "Remove"}
		</DeleteButton>
	);
};
