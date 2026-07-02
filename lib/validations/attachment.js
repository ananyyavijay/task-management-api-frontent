import {
  ALLOWED_ATTACHMENT_EXTENSIONS,
  MAX_ATTACHMENT_SIZE_BYTES,
} from "@/lib/constants";
import { getFileExtension, formatFileSize } from "@/utils/formatters";

/**
 * Validate a File against the exact rules documented for
 * POST /tasks/{id}/attachments before it's sent to the server.
 * This is a UX pre-check only — the backend remains the source of truth
 * and will still reject invalid files with 413 / 422.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateAttachmentFile(file) {
  if (!file) return { valid: false, error: "No file selected." };

  const extension = getFileExtension(file.name);
  if (!ALLOWED_ATTACHMENT_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `"${extension || "unknown"}" files aren't supported. Allowed types: ${ALLOWED_ATTACHMENT_EXTENSIONS.join(
        ", "
      )}.`,
    };
  }

  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is ${formatFileSize(
        file.size
      )}, which exceeds the 10 MB limit.`,
    };
  }

  return { valid: true };
}
