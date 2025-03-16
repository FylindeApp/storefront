import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { checkDraftMode } from "../store/slices/draftSlice";
import DraftToggle from "../components/admin/DraftToggle";

const AdminPage: React.FC = () => {
    const dispatch = useDispatch();
    const isDraftMode = useSelector((state: RootState) => state.draft.isDraftMode);

    useEffect(() => {
        dispatch(checkDraftMode());
    }, [dispatch]);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <DraftToggle />
            {isDraftMode ? (
                <p className="text-green-600 mt-4">✅ Draft Mode is Enabled</p>
            ) : (
                <p className="text-red-600 mt-4">❌ Draft Mode is Disabled</p>
            )}
        </div>
    );
};

export default AdminPage;
