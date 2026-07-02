/**
 * Constants mirrored 1:1 from the backend API design document.
 * Do not add, remove, or rename values here without a corresponding
 * change in the backend API contract.
 */

// tasks.status enum — CHECK (status IN (...))
export const TASK_STATUS = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

export const TASK_STATUS_OPTIONS = [
  TASK_STATUS.TODO,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.IN_REVIEW,
  TASK_STATUS.DONE,
];

// tasks.priority enum — CHECK (priority IN (...))
export const TASK_PRIORITY = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const TASK_PRIORITY_OPTIONS = [
  TASK_PRIORITY.LOW,
  TASK_PRIORITY.NORMAL,
  TASK_PRIORITY.HIGH,
  TASK_PRIORITY.CRITICAL,
];

// users.role enum
export const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
};

// project_members.role enum
export const PROJECT_MEMBER_ROLE = {
  OWNER: "owner",
  MEMBER: "member",
};

// POST /tasks/{id}/attachments — allowed extensions per the API contract
export const ALLOWED_ATTACHMENT_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".docx",
  ".xlsx",
];

// POST /tasks/{id}/attachments — 10 MB (10,485,760 bytes), returns 413 if exceeded
export const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;

// Pagination defaults shared by GET /projects/ and GET /tasks/
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// JWT access token lifetime, per Section 4.1 of the API design document
export const TOKEN_EXPIRE_MINUTES = 60;
