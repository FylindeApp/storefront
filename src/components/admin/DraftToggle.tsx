import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { enableDraft, disableDraft } from "../../api/draft";

const DraftToggle: React.FC = () => {
    const dispatch = useDispatch();
    const isDraftMode = useSelector((state: RootState) => state.draft.isDraftMode);

    return (
        <button
            onClick={() => (isDraftMode ? disableDraft(dispatch) : enableDraft(dispatch))}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
        >
            {isDraftMode ? "Disable Draft Mode" : "Enable Draft Mode"}
        </button>
    );
};

export default DraftToggle;
