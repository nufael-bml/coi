import { getApiBaseUrl } from "@/lib/runtime-api";

const API_BASE_URL = getApiBaseUrl();

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  documentTypeId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  blobUrl?: string; // Azure Blob Storage URL (if using cloud storage)
  createdAt: string;
  updatedAt: string;
  documentTypeName?: string;
}

export const documentService = {
  /**
   * Get all document types
   */
  async getDocumentTypes(): Promise<DocumentType[]> {
    const response = await fetch(`${API_BASE_URL}/document-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch document types");
    }

    return response.json();
  },

  /**
   * Get all documents for a project
   */
  async getDocuments(projectId: string): Promise<ProjectDocument[]> {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/documents`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }

    return response.json();
  },

  /**
   * Upload a document for a project
   */
  async uploadDocument(
    projectId: string,
    file: File,
    documentTypeId: string,
    uploadedBy?: string
  ): Promise<ProjectDocument> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentTypeId", documentTypeId);
    if (uploadedBy) {
      formData.append("uploadedBy", uploadedBy);
    }

    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/documents`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload document");
    }

    return response.json();
  },

  /**
   * Download a document
   */
  async downloadDocument(projectId: string, documentId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/documents/${documentId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download document");
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "download";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  /**
   * Delete a document
   */
  async deleteDocument(projectId: string, documentId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/projects/${projectId}/documents/${documentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete document");
    }
  },
};
