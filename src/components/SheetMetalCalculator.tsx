"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ruler, Layers, HelpCircle, Scale, Sparkles, CheckCircle2, Link2, Link } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { calculateSheetMetal, SheetMetalResult } from "@/lib/sheetMetalCalculations";
import { sheetMetalSchema, SheetMetalFormData } from "@/lib/schema";
import { Material, getMaterials } from "@/lib/materials";
import { LossSettings, getLossSettings } from "@/lib/settings";
import { MaterialSettings } from "./MaterialSettings";

export function SheetMetalCalculator() {
  const [result, setResult] = useState<SheetMetalResult | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [lossSettings, setLossSettings] = useState<LossSettings>({ moldFinishingLoss: 0, productionLoss: 0 });

  useEffect(() => {
    setMaterials(getMaterials());
    setLossSettings(getLossSettings());
  }, []);

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<SheetMetalFormData>({
    resolver: zodResolver(sheetMetalSchema),
    defaultValues: {
      areaMm2: undefined as number | undefined,
      thicknessMm: 0.4,
      complexity: "low",
      includePendantBail: true,
      includePendantChain: true,
    },
    mode: "onChange",
  });

  const areaMm2 = watch("areaMm2");
  const thicknessMm = watch("thicknessMm");
  const complexity = watch("complexity");
  const includePendantBail = watch("includePendantBail");
  const includePendantChain = watch("includePendantChain");

  useEffect(() => {
    const area = Number(areaMm2) || 0;
    const thickness = Number(thicknessMm) || 0;
    const comp = complexity ?? "low";

    if (area > 0 && thickness > 0) {
      const calculated = calculateSheetMetal({
        areaMm2: area,
        thicknessMm: thickness,
        complexity: comp,
        includePendantBail: includePendantBail ?? true,
        includePendantChain: includePendantChain ?? true,
      });
      setResult(calculated);
    } else {
      setResult(null);
    }
  }, [areaMm2, thicknessMm, complexity, includePendantBail, includePendantChain]);

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <Layers className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  2D Lazer Kesim Parametreleri
                </h2>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="areaMm2" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Ruler className="h-3.5 w-3.5 text-slate-500" />
                  Alan (mm²) <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Kesim parçasının alanı milimetrekare (square millimeters) cinsinden. Örn: 68.6471</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="areaMm2"
                  type="number"
                  step="0.0001"
                  placeholder="Örn: 68.6471"
                  className={`h-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
                    errors.areaMm2 ? "border-red-300 dark:border-red-700" : ""
                  }`}
                  {...register("areaMm2", { valueAsNumber: true })}
                />
                {errors.areaMm2 && (
                  <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.areaMm2.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="thicknessMm" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-slate-500" />
                  Kalınlık (mm) <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Astar kalınlığı milimetre cinsinden. Örn: 0.40 mm.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="thicknessMm"
                  type="number"
                  step="0.01"
                  placeholder="Örn: 0.40"
                  className={`h-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
                    errors.thicknessMm ? "border-red-300 dark:border-red-700" : ""
                  }`}
                  {...register("thicknessMm", { valueAsNumber: true })}
                />
                {errors.thicknessMm && (
                  <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.thicknessMm.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="complexity" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  Detay seviyesi <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Yüksek: Çok detaylı (Ayetel Kürsi vb.) — lazer %8, cila/tesviye daha fazla kayıp. Düşük: Basit (İsim kolye vb.) — lazer %2, daha az cila kaybı.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Controller
                  name="complexity"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`h-10 w-full border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 ${
                        errors.complexity ? "border-red-300 dark:border-red-700" : ""
                      }`}>
                        <SelectValue placeholder="Detay seviyesi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Yüksek (Ayetel Kürsi vb.)</SelectItem>
                        <SelectItem value="low">Düşük (İsim kolye vb.)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.complexity && (
                  <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.complexity.message}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Kolye Tepeliği</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {includePendantBail ? "Hesaba dahil" : "Hesaba dahil değil"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200/80 dark:bg-slate-600/80 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Kolye tepeliği (bail) ağırlığı hesaba eklenir. Açıksa +0,15 g eklenir.</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="rounded-md bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                      +0.15 g
                    </span>
                    <Controller
                      name="includePendantBail"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Kolye tepeliği hesaba dahil"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <Link className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Kolye Zinciri</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {includePendantChain ? "Hesaba dahil" : "Hesaba dahil değil"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200/80 dark:bg-slate-600/80 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                        >
                          <HelpCircle className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Kolye zinciri ağırlığı hesaba eklenir. Açıksa +1,00 g eklenir.</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="rounded-md bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                      +1.00 g
                    </span>
                    <Controller
                      name="includePendantChain"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-label="Kolye zinciri hesaba dahil"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:sticky lg:top-4 lg:h-fit">
            {!result ? (
              <Card className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardContent className="pt-6 pb-6">
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <Scale className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Hesaplama sonuçları burada görünecek
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-xl overflow-hidden animate-in fade-in duration-200">
                <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-b border-slate-200/50 dark:border-slate-700/50 py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                      <Layers className="h-4 w-4" />
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 bg-clip-text text-transparent">
                      2D Lazer Kesim Sonuçları
                    </h3>
                  </div>
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Scale className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Teorik Ham Ağırlık</span>
                      </div>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-50">{result.theoreticalG.toFixed(2)} g</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                          <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Lazer Sonrası</span>
                      </div>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-50">{result.afterLaserG.toFixed(2)} g</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-50">Final Ürün</span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-11">Cila kaybı: ×0.85 (%15)</span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {result.finalProductG.toFixed(2)} g
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <MaterialSettings
            onMaterialsChange={setMaterials}
            onLossSettingsChange={setLossSettings}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
