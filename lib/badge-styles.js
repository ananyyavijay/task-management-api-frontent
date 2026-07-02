import { TASK_PRIORITY, TASK_STATUS } from "./constants";

/**
 * Soft, low-saturation badge treatments — deliberately muted to match
 * the "no bright/flashy colors" brief. Every status/priority value here
 * corresponds 1:1 to a backend enum member; nothing is invented.
 */
export const STATUS_STYLES = {
  [TASK_STATUS.TODO]: {
    label: "Todo",
    classes: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300/70",
    dot: "bg-slate-400",
  },
  [TASK_STATUS.IN_PROGRESS]: {
    label: "In Progress",
    classes: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
    dot: "bg-blue-500",
  },
  [TASK_STATUS.IN_REVIEW]: {
    label: "In Review",
    classes: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20",
    dot: "bg-violet-500",
  },
  [TASK_STATUS.DONE]: {
    label: "Done",
    classes: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20",
    dot: "bg-green-500",
  },
};

export const PRIORITY_STYLES = {
  [TASK_PRIORITY.LOW]: {
    label: "Low",
    classes: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-300/70",
    dot: "bg-slate-400",
  },
  [TASK_PRIORITY.NORMAL]: {
    label: "Normal",
    classes: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
    dot: "bg-blue-500",
  },
  [TASK_PRIORITY.HIGH]: {
    label: "High",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    dot: "bg-amber-500",
  },
  [TASK_PRIORITY.CRITICAL]: {
    label: "Critical",
    classes: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
    dot: "bg-red-500",
  },
};
