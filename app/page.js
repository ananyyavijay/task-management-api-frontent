import { redirect } from "next/navigation";

// Middleware guarantees an authenticated request ever reaches this route
// (unauthenticated requests are redirected to /login before this renders).
export default function RootPage() {
  redirect("/dashboard");
}
