import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface Note {
  id: string;
  entityType: string;
  entityId: string;
  note: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  entityType: string;
  entityId: string;
  note: string;
  createdBy?: string;
}

export interface UpdateNoteRequest {
  note: string;
}

class NoteService {
  /**
   * Get all notes for a specific entity
   */
  async getNotes(entityType: string, entityId: string): Promise<Note[]> {
    const response = await fetch(
      `${API_BASE_URL}/notes?entityType=${entityType}&entityId=${entityId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch notes: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get a single note by ID
   */
  async getNote(noteId: string): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch note: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new note
   */
  async createNote(request: CreateNoteRequest): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to create note: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update an existing note
   */
  async updateNote(
    noteId: string,
    request: UpdateNoteRequest
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to update note: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete a note
   */
  async deleteNote(noteId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Helper to map frontend request type to backend entity type
   */
  getEntityType(requestType: string): string {
    const mapping: Record<string, string> = {
      project: "project",
      "project-subtask": "sub_task",
      "change-request": "change_request",
      "change-request-subtask": "change_request_sub_task",
    };
    return mapping[requestType] || requestType;
  }
}

export const noteService = new NoteService();
