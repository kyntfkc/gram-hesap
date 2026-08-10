"use client";

import { WeightCalculator } from "@/components/WeightCalculator";
import { SheetMetalCalculator } from "@/components/SheetMetalCalculator";
import { Logo } from "@/components/Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Scissors } from "lucide-react";

export default function Home() {
  return (
    <div className="h-dvh overflow-hidden max-lg:h-auto max-lg:min-h-dvh max-lg:overflow-visible bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col px-3 py-2 md:px-4 md:py-3 max-lg:h-auto">
        <Tabs defaultValue="weight" className="flex min-h-0 flex-1 flex-col gap-2 max-lg:flex-none">
          <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex justify-center sm:justify-start">
              <Logo />
            </div>
            <TabsList className="grid h-9 w-full max-w-sm grid-cols-2 mx-auto sm:mx-0">
              <TabsTrigger value="weight" className="gap-1.5 text-xs sm:text-sm">
                <Calculator className="h-3.5 w-3.5" />
                3D Modelleme
              </TabsTrigger>
              <TabsTrigger value="sheet" className="gap-1.5 text-xs sm:text-sm">
                <Scissors className="h-3.5 w-3.5" />
                Astar Kesim
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="weight" className="mt-0 min-h-0 flex-1 overflow-hidden max-lg:overflow-visible data-[state=inactive]:hidden">
            <WeightCalculator />
          </TabsContent>

          <TabsContent value="sheet" className="mt-0 min-h-0 flex-1 overflow-hidden max-lg:overflow-visible data-[state=inactive]:hidden">
            <SheetMetalCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
