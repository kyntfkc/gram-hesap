import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";

export default function GirisPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="relative flex w-full max-w-md flex-col items-center gap-6">
        <div className="text-center">
          <Logo />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            indigo | Gram Hesap
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
