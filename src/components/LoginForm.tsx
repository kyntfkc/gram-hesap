"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <Card className="w-full max-w-md border-slate-200/80 bg-white/90 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Giriş yap</CardTitle>
        <CardDescription>
          Hesaplayıcıyı kullanmak için oturum açın
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="ornek@indigo.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Parola</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>
          {state?.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Giriş yapılıyor…" : "Giriş yap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
