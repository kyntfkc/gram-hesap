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
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { calculateSheetMetal, calculateAreaFromWeight, SheetMetalResult, PENDANT_BAIL_WEIGHT_G, BRACELET_CHAIN_WEIGHT_G, getMaterialFactors } from "@/lib/sheetMetalCalculations";
import { sheetMetalSchema, SheetMetalFormData } from "@/lib/schema";
import { Material, getMaterials, defaultMaterial } from "@/lib/materials";
import { LossSettings, getLossSettings } from "@/lib/settings";
import { formatInt, formatGram, saveAreaMm2 } from "@/lib/copyDimensions";
import { CopyDimensionButton } from "@/components/CopyDimensionButton";
import { MaterialSettings } from "./MaterialSettings";
import { OptionGroup, OptionToggle } from "./OptionToggle";

export function SheetMetalCalculator() {
  const [result, setResult] = useState<SheetMetalResult | null>(null);
  const [areaResult, setAreaResult] = useState<number | null>(null);
  const [calcMode, setCalcMode] = useState<"gram-to-area" | "area-to-gram">("gram-to-area");
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
    setValue,
    formState: { errors },
  } = useForm<SheetMetalFormData>({
    resolver: zodResolver(sheetMetalSchema),
    defaultValues: {
      areaMm2: undefined as number | undefined,
      targetGramG: undefined as number | undefined,
      thicknessMm: 0.4,
      selectedMaterialId: "14k-gold",
      includePendantBail: false,
      includeBraceletChain: false,
    },
    mode: "onChange",
  });

  const areaMm2 = watch("areaMm2");
  const targetGramG = watch("targetGramG");
  const thicknessMm = watch("thicknessMm");
  const selectedMaterialId = watch("selectedMaterialId");
  const includePendantBail = watch("includePendantBail");
  const includeBraceletChain = watch("includeBraceletChain");

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId) ?? materials[0];
  const factors = getMaterialFactors(selectedMaterialId ?? "14k-gold");

  useEffect(() => {
    if (materials.length > 0 && !selectedMaterialId) {
      setValue("selectedMaterialId", "14k-gold");
    }
  }, [materials, selectedMaterialId, setValue]);

  useEffect(() => {
    const thickness = Number(thicknessMm) || 0;
    const matId = selectedMaterialId ?? "14k-gold";
    const density = selectedMaterial?.density ?? defaultMaterial.density;

    const baseParams = {
      thicknessMm: thickness,
      complexity: "low" as const,
      materialDensity: density,
      materialId: matId,
      includePendantBail: includePendantBail ?? false,
      includeBraceletChain: includeBraceletChain ?? false,
    };

    if (calcMode === "gram-to-area") {
      const target = Number(targetGramG) || 0;
      if (target > 0 && thickness > 0) {
        const calculated = calculateAreaFromWeight({
          ...baseParams,
          targetFinalG: target,
        });
        if (calculated) {
          setResult(calculated);
          setAreaResult(calculated.areaMm2);
          saveAreaMm2(calculated.areaMm2);
        } else {
          setResult(null);
          setAreaResult(null);
        }
      } else {
        setResult(null);
        setAreaResult(null);
      }
    } else {
      const area = Number(areaMm2) || 0;
      if (area > 0 && thickness > 0) {
        const calculated = calculateSheetMetal({
          ...baseParams,
          areaMm2: area,
        });
        setResult(calculated);
        setAreaResult(null);
        saveAreaMm2(area);
      } else {
        setResult(null);
        setAreaResult(null);
      }
    }
  }, [areaMm2, targetGramG, thicknessMm, selectedMaterialId, selectedMaterial, includePendantBail, includeBraceletChain, calcMode]);

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-0 gap-0">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    Parametreler
                  </h2>
                </div>
                <MaterialSettings
                  onMaterialsChange={setMaterials}
                  onLossSettingsChange={setLossSettings}
                />
              </div>

              <div className="flex gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Button
                  type="button"
                  variant={calcMode === "gram-to-area" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => setCalcMode("gram-to-area")}
                >
                  <Scale className="h-3.5 w-3.5 mr-1" />
                  Gram
                </Button>
                <Button
                  type="button"
                  variant={calcMode === "area-to-gram" ? "default" : "ghost"}
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => setCalcMode("area-to-gram")}
                >
                  <Ruler className="h-3.5 w-3.5 mr-1" />
                  Alan
                </Button>
              </div>

              {calcMode === "gram-to-area" ? (
              <div className="space-y-1.5">
                <Label htmlFor="targetGramG" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-slate-500" />
                  Hedef Final Ağırlık (g) <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Bitmiş ürünün hedef ağırlığını girin. Tepelik ve zincir dahil toplam gram.</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="targetGramG"
                  type="number"
                  step="0.01"
                  placeholder="Örn: 0.65"
                  className={`h-9 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
                    errors.targetGramG ? "border-red-300 dark:border-red-700" : ""
                  }`}
                  {...register("targetGramG", { valueAsNumber: true })}
                />
                {errors.targetGramG && (
                  <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                    <span className="text-red-500">⚠</span>
                    {errors.targetGramG.message}
                  </p>
                )}
              </div>
              ) : (
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
                  className={`h-9 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
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
              )}

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
                  className={`h-9 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
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
                <Label htmlFor="selectedMaterialId" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-slate-500" />
                  Malzeme <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="selectedMaterialId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9 w-full border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder="Malzeme seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <OptionGroup title="Ek parçalar" hint="Açıksa final ağırlığa eklenir">
                <OptionToggle
                  id="includePendantBail"
                  label="Kolye Tepeliği"
                  tooltip={`Kolye tepeliği (bail) ağırlığı. Açıksa +${PENDANT_BAIL_WEIGHT_G.toFixed(2).replace(".", ",")} g eklenir.`}
                  badge={`+${PENDANT_BAIL_WEIGHT_G.toFixed(2)} g`}
                  checked={includePendantBail ?? false}
                  onCheckedChange={(v) => setValue("includePendantBail", v)}
                  icon={<Link2 className="h-3.5 w-3.5" />}
                  iconTone="blue"
                />
                <OptionToggle
                  id="includeBraceletChain"
                  label="Bileklik Zinciri"
                  tooltip={`Bileklik zinciri ağırlığı. Açıksa +${BRACELET_CHAIN_WEIGHT_G.toFixed(2).replace(".", ",")} g eklenir.`}
                  badge={`+${BRACELET_CHAIN_WEIGHT_G.toFixed(2)} g`}
                  checked={includeBraceletChain ?? false}
                  onCheckedChange={(v) => setValue("includeBraceletChain", v)}
                  icon={<Link className="h-3.5 w-3.5" />}
                  iconTone="emerald"
                />
              </OptionGroup>
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
              <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-xl overflow-hidden animate-in fade-in duration-200 py-0 gap-0">
                <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-b border-slate-200/50 dark:border-slate-700/50 py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                      <Layers className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 bg-clip-text text-transparent">
                      Astar Kesim Sonuçları
                    </h3>
                  </div>
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center p-3.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Scale className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Teorik Ham Ağırlık</span>
                      </div>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-50">{formatGram(result.theoreticalG)} g</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                          <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Lazer Sonrası</span>
                      </div>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-50">{formatGram(result.afterLaserG)} g</span>
                    </div>
                    <div className="flex justify-between items-center p-3.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                          <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cila Sonrası</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Cila kaybı: ×{factors.finish} (%{Math.round((1 - factors.finish) * 100)})
                          </span>
                        </div>
                      </div>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-50">{formatGram(result.afterFinishG)} g</span>
                    </div>
                    {includePendantBail && (
                      <div className="flex justify-between items-center p-3.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Link2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kolye Tepeliği</span>
                        </div>
                        <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">+{formatGram(PENDANT_BAIL_WEIGHT_G)} g</span>
                      </div>
                    )}
                    {includeBraceletChain && (
                      <div className="flex justify-between items-center p-3.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Link className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Bileklik Zinciri</span>
                        </div>
                        <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">+{formatGram(BRACELET_CHAIN_WEIGHT_G)} g</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                          {calcMode === "gram-to-area" ? <Ruler className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                          {calcMode === "gram-to-area" ? "Gerekli Alan" : "Final Ürün"}
                        </span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        {calcMode === "gram-to-area" && areaResult != null
                          ? `${formatInt(areaResult)} mm²`
                          : `${formatGram(result.finalProductG)} g`}
                      </span>
                    </div>
                    <CopyDimensionButton type="area" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
