"use client";

import { logout } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type UserMenuProps = {
  name: string;
};

export function UserMenu({ name }: UserMenuProps) {
  return (
    <div className="absolute right-4 top-3 z-10 flex items-center gap-2 md:right-6 md:top-4">
      <span className="hidden text-sm text-slate-600 sm:inline dark:text-slate-400">
        {name}
      </span>
      <form action={logout}>
        <Button type="submit" variant="outline" size="sm" className="gap-1.5">
          <LogOut className="h-3.5 w-3.5" />
          Çıkış
        </Button>
      </form>
    </div>
  );
}
