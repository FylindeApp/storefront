import React from "react";
import { AddressSkeleton } from "./AddressSkeleton";
import { Skeleton } from "./Skeleton"; // Ensure correct import path

export const AddressSectionSkeleton: React.FC = () => (
	<div className="py-6">
		<Skeleton variant="title" className="w-1/3" />
		<AddressSkeleton />
		<Skeleton className="mt-4 w-3/4" />
	</div>
);
