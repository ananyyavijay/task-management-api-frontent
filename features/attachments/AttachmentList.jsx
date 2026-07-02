"use client";

import { Download, Paperclip } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ListRowsSkeleton } from "@/components/common/SkeletonLoaders";
import { FileTypeIcon } from "@/features/attachments/FileTypeIcon";
import { AssigneeChip } from "@/features/tasks/AssigneeChip";
import { useAttachmentsQuery } from "@/hooks/useAttachments";
import { formatFileSize, formatRelativeTime, getFileExtension } from "@/utils/formatters";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"];

export function AttachmentList({ taskId }) {
  const { data: attachments, isLoading } = useAttachmentsQuery(taskId);

  if (isLoading) {
    return <ListRowsSkeleton rows={3} />;
  }

  if (!attachments || attachments.length === 0) {
    return (
      <EmptyState
        icon={Paperclip}
        title="No attachments yet"
        description="Upload a file above to attach it to this task."
      />
    );
  }

  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-white">
      {attachments.map((attachment) => {
        const extension = getFileExtension(attachment.filename);
        const isImage = IMAGE_EXTENSIONS.includes(extension);

        return (
          <li key={attachment.id} className="flex items-center gap-3 p-3.5">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={attachment.blob_url}
                alt={attachment.filename}
                className="h-9 w-9 shrink-0 rounded-lg border border-border object-cover"
              />
            ) : (
              <FileTypeIcon extension={extension} />
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {attachment.filename}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                <span>{formatFileSize(attachment.size_bytes)}</span>
                <span aria-hidden="true">·</span>
                <span>{formatRelativeTime(attachment.uploaded_at)}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  by <AssigneeChip userId={attachment.uploaded_by} />
                </span>
              </div>
            </div>

            <a
              href={attachment.blob_url}
              target="_blank"
              rel="noopener noreferrer"
              download={attachment.filename}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={`Download ${attachment.filename}`}
            >
              <Download className="h-4 w-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
