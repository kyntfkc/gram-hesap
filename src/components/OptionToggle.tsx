"use client";

import { HelpCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface OptionToggleProps {
  id: string;
  label: string;
  tooltip?: string;
  badge: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon: React.ReactNode;
  iconTone?: "blue" | "indigo" | "purple" | "amber" | "emerald";
}

const toneMap = {
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const badgeToneMap = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export function OptionToggle({
  id,
  label,
  tooltip,
  badge,
  checked,
  onCheckedChange,
  icon,
  iconTone = "blue",
}: OptionToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-3 transition-colors",
        checked && "bg-slate-50/80 dark:bg-slate-800/40"
      )}
    >
      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", toneMap[iconTone])}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Label htmlFor={id} className="cursor-pointer text-sm font-medium text-slate-800 dark:text-slate-100">
            {label}
          </Label>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
          checked ? badgeToneMap[iconTone] : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
        )}
      >
        {badge}
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}

interface OptionGroupProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
}

export function OptionGroup({ title, hint, children }: OptionGroupProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
        {hint ? <span className="ml-1.5 font-normal normal-case tracking-normal text-slate-400">· {hint}</span> : null}
      </p>
      <div className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-700/80 divide-y divide-slate-100 dark:divide-slate-800 bg-white/60 dark:bg-slate-900/40">
        {children}
      </div>
    </div>
  );
}
