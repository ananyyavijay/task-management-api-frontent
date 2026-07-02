import "@/styles/globals.css";
import { AppProviders } from "@/providers/AppProviders";

export const metadata = {
  title: {
    default: "TaskFlow — Task Management",
    template: "%s · TaskFlow",
  },
  description:
    "A clean, modern workspace for managing projects, tasks and team assignments.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8FAFC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full min-h-screen bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
