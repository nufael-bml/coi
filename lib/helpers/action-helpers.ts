import { revalidatePath } from "next/cache";
import { z } from "zod";
import { FieldError, NotFoundError } from "@/lib/helpers/error-helpers";

/**
 * Format Zod validation errors into FormResponse structure
 */
function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const path = issue.path.join(".") || "root";
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });

  return errors;
}

export type FormResponse = {
  success: boolean;
  message?: string;
  error?: string | null; // ✅ Changed from 'string | undefined' to 'string | null | undefined'
  errors?: Record<string, string[]>;
};

/* ============================================================================
 * FORM ACTIONS (mutations with validation)
 * ========================================================================== */

type ActionConfig<T> = {
  schema: z.ZodSchema<T>;
  execute: (data: T) => Promise<string | { message: string } | void>;
  revalidate?: string | string[];
  successMessage?: string;
};

/**
 * Creates a type-safe server action with automatic validation and error handling
 * 
 * Usage:
 * export const myAction = createAction({
 *   schema: z.object({ name: z.string() }),
 *   execute: async (data) => {
 *     // Your logic here
 *     return "Success message";
 *   },
 *   revalidate: "/path/to/revalidate"
 * });
 */
export function createAction<T>(config: ActionConfig<T>) {
  // Return the actual server action function
  return async (
    _prevState: FormResponse,
    formData: FormData
  ): Promise<FormResponse> => {
    try {
      const rawData = Object.fromEntries(formData.entries());
      const result = config.schema.safeParse(rawData);

      if (!result.success) {
        return {
          success: false,
          error: "Please fix the errors below.",
          errors: formatZodErrors(result.error),
        };
      }

      const executeResult = await config.execute(result.data);

      if (config.revalidate) {
        const paths = Array.isArray(config.revalidate)
          ? config.revalidate
          : [config.revalidate];
        
        paths.forEach((path) => {
          try {
            revalidatePath(path);
          } catch (error) {
            console.error(`Failed to revalidate path: ${path}`, error);
          }
        });
      }

      let message = config.successMessage;
      
      if (!message) {
        if (typeof executeResult === "string") {
          message = executeResult;
        } else if (executeResult && typeof executeResult === "object" && "message" in executeResult) {
          message = executeResult.message;
        } else {
          message = "Action completed successfully.";
        }
      }

      return {
        success: true,
        message,
      };
    } catch (error) {
      if (error instanceof FieldError) {
        return {
          success: false,
          error: error.message,
          errors: error.fields,
        };
      }

      if (error instanceof Error) {
        console.error("Action error:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });

        return {
          success: false,
          error: error.message,
        };
      }

      console.error("Unknown action error:", error);

      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };
}

/* ============================================================================
 * QUERY HELPERS (read operations)
 * ========================================================================== */

type QueryConfig<TOutput> = {
  execute: () => Promise<TOutput>;
};

/**
 * Creates a simple query function without input validation
 * 
 * Usage:
 * export const getUsers = createQuery({
 *   execute: async () => {
 *     return await db.users.findMany();
 *   }
 * });
 */
export function createQuery<TOutput>(config: QueryConfig<TOutput>) {
  return async (): Promise<TOutput> => {
    try {
      return await config.execute();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Query error:", {
          message: error.message,
          stack: error.stack,
        });
        throw error;
      }

      console.error("Unknown query error:", error);
      throw new Error("Failed to fetch data. Please try again.");
    }
  };
}

type QueryByIdConfig<TOutput> = {
  execute: (id: string) => Promise<TOutput | null>;
  notFoundMessage?: string;
};

/**
 * Creates a query to fetch a single item by ID
 * 
 * Usage:
 * export const getUserById = createQueryById({
 *   execute: async (id) => {
 *     return await db.users.findUnique({ where: { id } });
 *   },
 *   notFoundMessage: "User not found"
 * });
 */
export function createQueryById<TOutput>(config: QueryByIdConfig<TOutput>) {
  return async (id: string): Promise<TOutput> => {
    try {
      if (!id) {
        throw new Error("ID is required");
      }

      const result = await config.execute(id);

      if (!result) {
        throw new NotFoundError(config.notFoundMessage || "Resource not found");
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundError) {
        console.warn("Resource not found:", error.message);
        throw error;
      }

      if (error instanceof Error) {
        console.error("Query by ID error:", {
          message: error.message,
          stack: error.stack,
          id,
        });
        throw error;
      }

      console.error("Unknown query by ID error:", error);
      throw new Error("Failed to fetch data. Please try again.");
    }
  };
}

/* ============================================================================
 * UTILITY HELPERS
 * ========================================================================== */

/**
 * Type helper to extract validated data type from a schema
 */
export type InferSchema<T> = T extends z.ZodSchema<infer U> ? U : never;