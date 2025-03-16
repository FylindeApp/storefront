import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    // ✅ Check if it's an AxiosError
    if ((error as AxiosError).isAxiosError) {
      const axiosError = error as AxiosError;

      // ✅ Ensure `response` and `data` exist before accessing `.message`
      if (axiosError.response?.data && typeof axiosError.response.data === "object") {
        const data = axiosError.response.data as { message?: string };
        return data.message || axiosError.message || "An Axios error occurred";
      }

      return axiosError.message || "An Axios error occurred";
    }

    // ✅ Check if it's a standard JavaScript Error
    if (error instanceof Error) {
      return error.message;
    }

    // ✅ Handle cases where `error` has a `message` property but isn't an instance of `Error`
    if ("message" in error && typeof (error as any).message === "string") {
      return (error as { message: string }).message;
    }
  }

  return "An unknown error occurred"; // ✅ Default fallback
}
