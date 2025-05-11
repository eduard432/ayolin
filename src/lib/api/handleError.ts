import { ZodErrorWithSource } from "./validate";
import { ZodError } from "zod";

export function handleApiError(error: unknown): Response {
  if (error instanceof ZodError) {
    const source = (error as ZodErrorWithSource).source || "unknown";

    return new Response(
      JSON.stringify({
        error: `Validation error in ${source}`,
        issues: error.flatten(),
      }),
      { status: 422 }
    );
  }

  return new Response(
    JSON.stringify({
      error: "Unexpected error",
      message: (error as Error)?.message || "Unknown server error",
    }),
    { status: 500 }
  );
}
