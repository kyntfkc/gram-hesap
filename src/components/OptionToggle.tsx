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
        "flex items-center gap-2 px-2.5 py-1.5 transition-colors",
        checked && "bg-slate-50/80 dark:bg-slate-800/40"
      )}
    >
      <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", toneMap[iconTone])}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <Label htmlFor={id} className="cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-100">
            {label}
          </Label>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <HelpCircle className="h-3 w-3" />
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
          "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
          checked ? badgeToneMap[iconTone] : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
        )}
      >
        {badge}
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} aria-label={label} className="scale-90" />
    </div>
  );
}

interface OptionGroupProps {
  title: string;
  children: React.ReactNode;
}

export function OptionGroup({ title, children }: OptionGroupProps) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <div className="overflow-hidden rounded-lg border border-slate-200/80 dark:border-slate-700/80 divide-y divide-slate-100 dark:divide-slate-800 bg-white/60 dark:bg-slate-900/40">
        {children}
      </div>
    </div>
  );
}
