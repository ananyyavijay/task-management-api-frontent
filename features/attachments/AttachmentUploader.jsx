"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { validateAttachmentFile } from "@/lib/validations/attachment";
import { useUploadAttachmentMutation } from "@/hooks/useAttachments";
import { ALLOWED_ATTACHMENT_EXTENSIONS, MAX_ATTACHMENT_SIZE_BYTES } from "@/lib/constants";
import { formatFileSize } from "@/utils/formatters";
import { cn } from "@/lib/utils";

export function AttachmentUploader({ taskId }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFileName, setCurrentFileName] = useState(null);
  const uploadMutation = useUploadAttachmentMutation(taskId);

  const processFiles = useCallback(
    async (fileList) => {
      const files = Array.from(fileList);
      for (const file of files) {
        const validation = validateAttachmentFile(file);
        if (!validation.valid) {
          toast.error(file.name, { description: validation.error });
          continue;
        }
        setCurrentFileName(file.name);
        try {
          await uploadMutation.mutateAsync(file);
        } catch {
          // The mutation's onError already surfaces a toast.
        }
      }
      setCurrentFileName(null);
    },
    [uploadMutation]
  );

  const openPicker = () => inputRef.current?.click();

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files?.length) {
      processFiles(event.dataTransfer.files);
    }
  };

  const handleBrowse = (event) => {
    if (event.target.files?.length) {
      processFiles(event.target.files);
    }
    event.target.value = "";
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload attachment"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
          isDragging
            ? "border-accent bg-accent/5"
            : "border-border bg-secondary/30 hover:bg-secondary/50"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft">
          <UploadCloud className="h-5 w-5 text-accent" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Drag & drop a file, or <span className="text-accent">browse</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {ALLOWED_ATTACHMENT_EXTENSIONS.join(", ")} · up to{" "}
          {formatFileSize(MAX_ATTACHMENT_SIZE_BYTES)}
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept={ALLOWED_ATTACHMENT_EXTENSIONS.join(",")}
          onChange={handleBrowse}
        />
      </div>

      {uploadMutation.isPending && (
        <div className="mt-3 space-y-1.5 rounded-lg border border-border bg-white p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="truncate font-medium text-foreground">
              Uploading {currentFileName}…
            </span>
            <span className="text-muted-foreground">{uploadMutation.progress}%</span>
          </div>
          <Progress value={uploadMutation.progress} />
        </div>
      )}
    </div>
  );
}
