"use server";

import { users } from "@/lib/data/users";
import { createAction, createQuery, createQueryById } from "@/lib/helpers/action-helpers";
import { FieldError, NotFoundError } from "@/lib/helpers/error-helpers";
import { userSchema, updateUserSchema, type UserInput } from "@/lib/schemas/user-schema";
import z from "zod";

/* -------------------------------- Types -------------------------------- */
export type User = UserInput & {
  id: string;
  stats: {
    projects: number;
    projectsChange: string;
    tasksCompleted: number;
    tasksChange: string;
    teamMembers: number;
    teamsCount: number;
  };
};

/* -------------------------------- Queries -------------------------------- */
export const getUsers = createQuery({
  execute: async () => users,
});

export const getUserById = createQueryById({
  execute: async (id) => users.find((user) => user.id === id) || null,
  notFoundMessage: "User not found",
});

/* -------------------------------- Actions -------------------------------- */
export const createUserAction = createAction({
  schema: userSchema,
  revalidate: "/users",
  execute: async (data) => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new FieldError("A user with this email already exists.", {
        email: ["This email is already registered."],
      });
    }

    const newUser: User = {
      ...data,
      id: String(users.length + 1),
      stats: {
        projects: 0,
        projectsChange: "New user",
        tasksCompleted: 0,
        tasksChange: "New user",
        teamMembers: 0,
        teamsCount: 0,
      },
    };

    users.push(newUser);
    return `User ${newUser.name} has been created successfully.`;
  },
});

export const updateUserAction = createAction({
  schema: updateUserSchema,
  revalidate: "/users",
  execute: async (data) => {
    const user = users.find((u) => u.id === data.id);
    if (!user) throw new NotFoundError("User not found.");

    const duplicate = users.find(
      (u) => u.id !== data.id && u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (duplicate) {
      throw new FieldError("A user with this email already exists.", {
        email: ["This email is already registered by another user."],
      });
    }

    Object.assign(user, data);
    return `User ${data.name} has been updated successfully.`;
  },
});

export const uploadUserFilesAction = createAction({
  schema: z.object({
    userId: z.string().min(1, "User ID is required"),
    files: z.any().optional(), // Files are handled separately in FormData
  }),
  revalidate: "/users",
  execute: async (data) => {
    const files = data.files;
    console.log("Received files:", files);
    const user = users.find((u) => u.id === data.userId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    // Note: Files are accessed directly from FormData in the action
    // This is just validation for the userId
    // Actual file processing would happen in the createAction wrapper
    // by accessing formData.getAll("files") before schema validation

    return `Files uploaded successfully for ${user.name}.`;
  },
});

export const deleteUserAction = createAction({
  schema: z.object({ id: z.string() }),
  revalidate: "/users",
  execute: async (data) => {
    const index = users.findIndex((u) => u.id === data.id);
    if (index === -1) throw new NotFoundError("User not found.");

    const user = users[index];
    users.splice(index, 1);
    return `User ${user.name} has been deleted successfully.`;
  },
});
