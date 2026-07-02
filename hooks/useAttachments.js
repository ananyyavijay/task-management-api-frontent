"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { listAttachments, uploadAttachment } from "@/services/attachmentService";
import { taskKeys } from "@/hooks/useTasks";

const attachmentKeys = {
  all: ["attachments"],
  list: (taskId) => [...attachmentKeys.all, "list", taskId],
};

/** GET /tasks/{id}/attachments */
export function useAttachmentsQuery(taskId) {
  return useQuery({
    queryKey: attachmentKeys.list(taskId),
    queryFn: () => listAttachments(taskId),
    enabled: Boolean(taskId),
  });
}

/** POST /tasks/{id}/attachments — tracks per-file upload progress for the UI. */
export function useUploadAttachmentMutation(taskId) {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (file) => {
      setProgress(0);
      return uploadAttachment(taskId, file, setProgress);
    },
    onSuccess: (attachment) => {
      queryClient.invalidateQueries({ queryKey: attachmentKeys.list(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      toast.success("File uploaded", { description: attachment.filename });
    },
    onError: (error) => {
      toast.error("Upload failed", { description: error.detail });
    },
    onSettled: () => setProgress(0),
  });

  return { ...mutation, progress };
}
