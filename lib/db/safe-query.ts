/**
 * A utility to run database queries with a timeout and graceful error handling.
 * This prevents slow network or database responses from crashing the server
 * and hanging page loads indefinitely.
 */

// Default timeout of 10 seconds
const DEFAULT_TIMEOUT_MS = 20000;

export type SafeQueryResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

/**
 * Wraps a database query promise with a timeout and error handling.
 *
 * @param queryFn - A function that returns the query promise (lazy, so it's only
 *                  executed when safeQuery runs).
 * @param options.timeoutMs  - Max time to wait (default: 10 000 ms).
 * @param options.context    - Label for error logs (e.g. "flash deals").
 * @param options.fallbackData - Value to return on failure instead of an error result.
 *
 * @example
 * const result = await safeQuery(
 *   () => db.select().from(products),
 *   { context: "products", fallbackData: [] }
 * );
 * // result.data is always an array — never crashes the page.
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  options: {
    timeoutMs?: number;
    context?: string;
    fallbackData?: T;
  } = {}
): Promise<SafeQueryResult<T>> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  try {
    // Create a timeout promise that rejects after timeoutMs
    const timeoutPromise = new Promise<never>((_, reject) => {
      const id = setTimeout(() => {
        reject(new Error(`Database query timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      // Allow Node to exit even if the timer is still pending
      if (typeof id === "object" && "unref" in id) id.unref();
    });

    // Race the actual query against the timeout
    const result = await Promise.race([queryFn(), timeoutPromise]);

    return { success: true, data: result };
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown database error";
    const label = options.context ? ` [${options.context}]` : "";
    console.error(`Database Error${label}:`, errorMsg);

    // If a fallback was provided, return it as a successful result
    if (options.fallbackData !== undefined) {
      return { success: true, data: options.fallbackData };
    }

    return { success: false, error: errorMsg };
  }
}
