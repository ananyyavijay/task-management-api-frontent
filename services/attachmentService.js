import { apiClient } from "./apiClient";

/**
 * POST /tasks/{id}/attachments — multipart/form-data, field name "file".
 * Server rejects files > 10MB (413) or with a disallowed extension (422).
 * @param {string} taskId
 * @param {File} file
 * @param {(percent: number) => void} [onProgress]
 * @returns {Promise<import('@/types/attachment').Attachment>}
 */
export async function uploadAttachment(taskId, file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post(
    `/tasks/${taskId}/attachments`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    }
  );
  return data;
}

/**
 * GET /tasks/{id}/attachments
 * @param {string} taskId
 * @returns {Promise<import('@/types/attachment').Attachment[]>}
 */
export async function listAttachments(taskId) {
  const { data } = await apiClient.get(`/tasks/${taskId}/attachments`);
  return data;
}
