"use client";

import { WeightCalculator } from "@/components/WeightCalculator";
import { SheetMetalCalculator } from "@/components/SheetMetalCalculator";
import { Logo } from "@/components/Logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Scissors } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="container relative mx-auto px-4 py-4 md:py-6 lg:py-8">
        <div className="mb-6 text-center">
          <Logo />
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400 md:text-lg max-w-2xl mx-auto">
            3D modelleme ve astar kesim ağırlık hesaplama
          </p>
        </div>

        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="weight" className="gap-2">
              <Calculator className="h-4 w-4" />
              3D Modelleme
            </TabsTrigger>
            <TabsTrigger value="sheet" className="gap-2">
              <Scissors className="h-4 w-4" />
              Astar Kesim
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weight" className="mt-0">
            <WeightCalculator />
          </TabsContent>

          <TabsContent value="sheet" className="mt-0">
            <SheetMetalCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
