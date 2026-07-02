import { FileText, FileImage, FileSpreadsheet, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  ".pdf": { icon: FileText, className: "bg-red-50 text-red-600" },
  ".png": { icon: FileImage, className: "bg-blue-50 text-blue-600" },
  ".jpg": { icon: FileImage, className: "bg-blue-50 text-blue-600" },
  ".jpeg": { icon: FileImage, className: "bg-blue-50 text-blue-600" },
  ".docx": { icon: FileText, className: "bg-indigo-50 text-indigo-600" },
  ".xlsx": { icon: FileSpreadsheet, className: "bg-green-50 text-green-600" },
};

export function FileTypeIcon({ extension, className, size = "h-9 w-9" }) {
  const entry = ICON_MAP[extension?.toLowerCase()] || {
    icon: FileIcon,
    className: "bg-slate-100 text-slate-500",
  };
  const Icon = entry.icon;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg",
        size,
        entry.className,
        className
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </div>
  );
}
