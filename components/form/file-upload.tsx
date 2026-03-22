"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  X,
  File,
  FileText,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  FileArchive,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

/* ---------------------------------- Types ---------------------------------- */

export type FileUploadFile = {
  file: File;
  id: string;
  preview?: string;
  progress?: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
};

type FileUploadProps = {
  name?: string;
  value?: FileUploadFile[];
  onValueChange?: (files: FileUploadFile[]) => void;
  accept?: string;
  maxSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  showProgress?: boolean;
  variant?: "default" | "compact" | "inline";
};

/* --------------------------------- Helpers --------------------------------- */

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (type.includes("pdf")) return FileText;
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) return FileArchive;
  return File;
};

const generateId = () => Math.random().toString(36).substring(2, 15);

const createFileUploadFile = (file: File): FileUploadFile => ({
  file,
  id: generateId(),
  preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
  progress: 0,
  status: "idle",
});

/* ------------------------------- Main Component ------------------------------- */

export function FileUpload({
  name = "files",
  value = [],
  onValueChange,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  multiple = true,
  disabled = false,
  className,
  showPreview = true,
  showProgress = true,
  variant = "default",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const files = value;
  const setFiles = onValueChange || (() => {});

  // Expose files to form
  React.useEffect(() => {
    if (fileInputRef.current && files.length > 0) {
      const dataTransfer = new DataTransfer();
      files.forEach((f) => {
        dataTransfer.items.add(f.file);
      });
      fileInputRef.current.files = dataTransfer.files;
    }
  }, [files]);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    
    if (accept) {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileExtension = `.${file.name.split(".").pop()}`;
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension === type;
        }
        if (type.endsWith("/*")) {
          return mimeType.startsWith(type.replace("/*", ""));
        }
        return mimeType === type;
      });

      if (!isAccepted) {
        return `File type not accepted. Allowed: ${accept}`;
      }
    }

    return null;
  };

  const addFiles = (newFiles: File[]) => {
    setError(null);

    if (!multiple && newFiles.length > 1) {
      setError("Only one file is allowed");
      return;
    }

    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validatedFiles: FileUploadFile[] = [];
    const errors: string[] = [];

    newFiles.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validatedFiles.push(createFileUploadFile(file));
      }
    });

    if (errors.length > 0) {
      setError(errors.join(", "));
    }

    if (validatedFiles.length > 0) {
      setFiles(multiple ? [...files, ...validatedFiles] : validatedFiles);
    }
  };

  const removeFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFiles(files.filter((f) => f.id !== id));
    setError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = ""; // Reset input
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
    setError(null);
  };

  // Cleanup previews on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [files]);

  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || (files.length >= maxFiles)}
          >
            <Upload className="mr-2 h-4 w-4" />
            {files.length > 0 ? "Add More" : "Choose Files"}
          </Button>
          {files.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {files.length > 0 && (
          <FileList
            files={files}
            onRemove={removeFile}
            showPreview={showPreview}
            showProgress={showProgress}
          />
        )}
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || (files.length >= maxFiles)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
        {files.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {files.length} file{files.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        id={`file-input-${name}`}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {/* Drop Zone */}
      <label
        htmlFor={`file-input-${name}`}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer block",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
          disabled && "opacity-50 cursor-not-allowed",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className={cn(
            "p-4 rounded-full transition-all duration-200",
            isDragging ? "bg-primary/20 scale-110" : "bg-primary/10"
          )}>
            <Upload className={cn(
              "h-8 w-8 transition-colors",
              isDragging ? "text-primary" : "text-primary/70"
            )} />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {isDragging ? "Drop files here" : "Drag and drop files here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click here to browse
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            {/* <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || files.length >= maxFiles}
            >
              Browse Files
            </Button> */}
            <div className="text-xs text-muted-foreground space-y-0.5">
              {accept && <p>Accepted: {accept}</p>}
              {maxSize && <p>Max size: {formatFileSize(maxSize)}</p>}
              {maxFiles && <p>Max files: {maxFiles}</p>}
            </div>
          </div>
        </div>
      </label>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Selected Files ({files.length}/{maxFiles})
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
              disabled={disabled}
            >
              Clear All
            </Button>
          </div>
          <FileList
            files={files}
            onRemove={removeFile}
            showPreview={showPreview}
            showProgress={showProgress}
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------- File List ------------------------------- */

type FileListProps = {
  files: FileUploadFile[];
  onRemove: (id: string) => void;
  showPreview?: boolean;
  showProgress?: boolean;
};

function FileList({ files, onRemove, showPreview, showProgress }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <ScrollArea className="max-h-[300px] /pr-4">
      <div className="space-y-2">
        {files.map((fileItem) => (
          <FileItem
            key={fileItem.id}
            fileItem={fileItem}
            onRemove={onRemove}
            showPreview={showPreview}
            showProgress={showProgress}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

/* ------------------------------- File Item ------------------------------- */

type FileItemProps = {
  fileItem: FileUploadFile;
  onRemove: (id: string) => void;
  showPreview?: boolean;
  showProgress?: boolean;
};

function FileItem({ fileItem, onRemove, showPreview, showProgress }: FileItemProps) {
  const { file, id, preview, progress, status, error } = fileItem;
  const Icon = getFileIcon(file.type);

  return (
    <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg border border-border/50 transition-all hover:bg-accent/70">
      {/* Icon or Preview */}
      {showPreview && preview ? (
        <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${preview})` }}
            role="img"
            aria-label={file.name}
          />
        </div>
      ) : (
        <div className="p-2 bg-background rounded flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      )}

      {/* File Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>

          {/* Status Icon */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {status === "uploading" && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            {status === "error" && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(id)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && status === "uploading" && progress !== undefined && (
          <Progress value={progress} className="h-1" />
        )}

        {/* Error Message */}
        {status === "error" && error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- Exports ------------------------------- */

export { formatFileSize, getFileIcon, createFileUploadFile };
export type { FileUploadProps, FileListProps, FileItemProps };