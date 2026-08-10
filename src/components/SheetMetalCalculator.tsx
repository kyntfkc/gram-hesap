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
import { Ruler, Layers, HelpCircle, Scale, CheckCircle2, Link2, Link } from "lucide-react";
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
      <div className="flex h-full min-h-0 w-full flex-col">
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2">
          <Card className="min-h-0 border-0 bg-white/80 shadow-xl backdrop-blur-xl dark:bg-slate-900/80">
            <CardContent className="space-y-2.5 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 p-1 text-white">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Parametreler</h2>
                </div>
                <MaterialSettings
                  onMaterialsChange={setMaterials}
                  onLossSettingsChange={setLossSettings}
                />
              </div>

              <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                <Button
                  type="button"
                  variant={calcMode === "gram-to-area" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 flex-1 text-[11px]"
                  onClick={() => setCalcMode("gram-to-area")}
                >
                  <Scale className="mr-1 h-3 w-3" />
                  Gram → Alan
                </Button>
                <Button
                  type="button"
                  variant={calcMode === "area-to-gram" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 flex-1 text-[11px]"
                  onClick={() => setCalcMode("area-to-gram")}
                >
                  <Ruler className="mr-1 h-3 w-3" />
                  Alan → Gram
                </Button>
              </div>

              {calcMode === "gram-to-area" ? (
                <div className="space-y-1">
                  <Label htmlFor="targetGramG" className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Scale className="h-3 w-3 text-slate-500" />
                    Hedef Final Ağırlık (g) <span className="text-red-500">*</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 cursor-help text-slate-400" />
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
                    className={`h-8 text-sm ${errors.targetGramG ? "border-red-300" : ""}`}
                    {...register("targetGramG", { valueAsNumber: true })}
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <Label htmlFor="areaMm2" className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Ruler className="h-3 w-3 text-slate-500" />
                    Alan (mm²) <span className="text-red-500">*</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 cursor-help text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Kesim parçasının alanı milimetrekare cinsinden.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="areaMm2"
                    type="number"
                    step="0.0001"
                    placeholder="Örn: 68.6471"
                    className={`h-8 text-sm ${errors.areaMm2 ? "border-red-300" : ""}`}
                    {...register("areaMm2", { valueAsNumber: true })}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="thicknessMm" className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Layers className="h-3 w-3 text-slate-500" />
                    Kalınlık (mm) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="thicknessMm"
                    type="number"
                    step="0.01"
                    placeholder="0.40"
                    className={`h-8 text-sm ${errors.thicknessMm ? "border-red-300" : ""}`}
                    {...register("thicknessMm", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Scale className="h-3 w-3 text-slate-500" />
                    Malzeme <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="selectedMaterialId"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue placeholder="Malzeme" />
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
              </div>

              <OptionGroup title="Ek parçalar">
                <OptionToggle
                  id="includePendantBail"
                  label="Kolye Tepeliği"
                  tooltip={`Kolye tepeliği (bail) ağırlığı. Açıksa +${PENDANT_BAIL_WEIGHT_G.toFixed(2).replace(".", ",")} g eklenir.`}
                  badge={`+${PENDANT_BAIL_WEIGHT_G.toFixed(2)} g`}
                  checked={includePendantBail ?? false}
                  onCheckedChange={(v) => setValue("includePendantBail", v)}
                  icon={<Link2 className="h-3 w-3" />}
                  iconTone="blue"
                />
                <OptionToggle
                  id="includeBraceletChain"
                  label="Bileklik Zinciri"
                  tooltip={`Bileklik zinciri ağırlığı. Açıksa +${BRACELET_CHAIN_WEIGHT_G.toFixed(2).replace(".", ",")} g eklenir.`}
                  badge={`+${BRACELET_CHAIN_WEIGHT_G.toFixed(2)} g`}
                  checked={includeBraceletChain ?? false}
                  onCheckedChange={(v) => setValue("includeBraceletChain", v)}
                  icon={<Link className="h-3 w-3" />}
                  iconTone="emerald"
                />
              </OptionGroup>
            </CardContent>
          </Card>

          <div className="min-h-0">
            {!result ? (
              <Card className="flex h-full min-h-[180px] items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                <CardContent className="py-6">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                      <Scale className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Hesaplama sonuçları burada görünecek
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl backdrop-blur-xl dark:from-slate-900 dark:to-slate-800/50">
                <div className="border-b border-slate-200/50 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-3 py-2 dark:border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 p-1 text-white">
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">Sonuçlar</h3>
                  </div>
                </div>
                <CardContent className="space-y-1.5 p-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200/50 bg-slate-50/80 px-2.5 py-1.5 dark:border-slate-700/50 dark:bg-slate-800/40">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Teorik Ham</span>
                    <span className="text-sm font-bold tabular-nums">{formatGram(result.theoreticalG)} g</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200/50 bg-slate-50/80 px-2.5 py-1.5 dark:border-slate-700/50 dark:bg-slate-800/40">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Lazer Sonrası</span>
                    <span className="text-sm font-bold tabular-nums">{formatGram(result.afterLaserG)} g</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200/50 bg-slate-50/80 px-2.5 py-1.5 dark:border-slate-700/50 dark:bg-slate-800/40">
                    <div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Cila Sonrası</span>
                      <span className="ml-1 text-[10px] text-slate-400">×{factors.finish}</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{formatGram(result.afterFinishG)} g</span>
                  </div>
                  {includePendantBail && (
                    <div className="flex items-center justify-between rounded-lg border border-slate-200/50 px-2.5 py-1.5 dark:border-slate-700/50">
                      <span className="text-xs font-medium text-slate-600">Kolye Tepeliği</span>
                      <span className="text-sm font-bold text-emerald-600 tabular-nums">+{formatGram(PENDANT_BAIL_WEIGHT_G)} g</span>
                    </div>
                  )}
                  {includeBraceletChain && (
                    <div className="flex items-center justify-between rounded-lg border border-slate-200/50 px-2.5 py-1.5 dark:border-slate-700/50">
                      <span className="text-xs font-medium text-slate-600">Bileklik Zinciri</span>
                      <span className="text-sm font-bold text-emerald-600 tabular-nums">+{formatGram(BRACELET_CHAIN_WEIGHT_G)} g</span>
                    </div>
                  )}
                  <div className="mt-1 flex items-center justify-between rounded-xl border-2 border-blue-200/50 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-3 py-2.5 dark:border-blue-800/50">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 text-white">
                        {calcMode === "gram-to-area" ? <Ruler className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {calcMode === "gram-to-area" ? "Gerekli Alan" : "Final Ürün"}
                      </span>
                    </div>
                    <span className="text-xl font-bold tabular-nums bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                      {calcMode === "gram-to-area" && areaResult != null
                        ? `${formatInt(areaResult)} mm²`
                        : `${formatGram(result.finalProductG)} g`}
                    </span>
                  </div>
                  <CopyDimensionButton type="area" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
