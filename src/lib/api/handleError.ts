import { ZodError } from "zod";

export function handleApiError(error: unknown): Response {
  if (error instanceof ZodError) {
    return new Response(
      JSON.stringify({
        error: "Error de validación",
        issues: error.flatten(),
      }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({
      error: (error as Error)?.message || "Error desconocido",
    }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}
