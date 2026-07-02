import { Suspense } from "react";
import { LoginForm } from "@/features/auth/LoginForm";
import { LoginFormSkeleton } from "@/features/auth/LoginFormSkeleton";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
