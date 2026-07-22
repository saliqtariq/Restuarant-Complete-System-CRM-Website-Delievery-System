export async function readJsonBody<T>(
  request: Request,
  maxBytes: number
): Promise<T> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new Error("Request body is too large");
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > maxBytes) {
    throw new Error("Request body is too large");
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

export function isBodyParsingError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message === "Request body is too large" ||
      error.message === "Invalid JSON body")
  );
}
