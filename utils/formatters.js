import { format, formatDistanceToNow, parseISO } from "date-fns";

/**
 * Format an ISO 8601 UTC timestamp as an absolute, human-readable date.
 * @param {string|null|undefined} isoString
 * @param {string} [pattern]
 */
export function formatDate(isoString, pattern = "MMM d, yyyy") {
  if (!isoString) return "—";
  try {
    return format(parseISO(isoString), pattern);
  } catch {
    return "—";
  }
}

/**
 * Format an ISO 8601 UTC timestamp as a relative time, e.g. "3 hours ago".
 * @param {string|null|undefined} isoString
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return "—";
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
  } catch {
    return "—";
  }
}

/**
 * Format a byte count as a human-readable file size (e.g. "1.2 MB").
 * @param {number} bytes
 */
export function formatFileSize(bytes) {
  if (bytes === 0 || bytes === undefined || bytes === null) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

/**
 * Derive short, deterministic initials from a username or email —
 * used for avatar fallbacks anywhere a display name isn't available.
 * @param {string} value
 */
export function getInitials(value) {
  if (!value) return "?";
  const clean = value.split("@")[0];
  const parts = clean.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

/**
 * Shorten a UUID for compact display, e.g. "3f1e2d4c…7890".
 * @param {string} id
 */
export function shortenId(id) {
  if (!id) return "—";
  if (id.length <= 12) return id;
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

/**
 * Extract the lowercase file extension (with leading dot) from a filename.
 * @param {string} filename
 */
export function getFileExtension(filename) {
  const match = /\.[^.]+$/.exec(filename || "");
  return match ? match[0].toLowerCase() : "";
}
