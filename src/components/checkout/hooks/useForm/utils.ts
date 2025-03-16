import { type FormErrors } from "../../hooks/useForm/types";

export const hasErrors = (formErrors: FormErrors<any>) => !!Object.keys(formErrors).length;
