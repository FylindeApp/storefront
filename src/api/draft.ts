import type { AppDispatch } from "../store"; // ✅ Use `import type`
import { enableDraftMode, disableDraftMode } from "../store/slices/draftSlice";

export const enableDraft = (dispatch: AppDispatch) => {
    dispatch(enableDraftMode());
    window.location.reload();
};

export const disableDraft = (dispatch: AppDispatch) => {
    dispatch(disableDraftMode());
    window.location.reload();
};
