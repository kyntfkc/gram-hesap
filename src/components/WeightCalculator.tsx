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
import { Calculator, Ruler, Gem, Settings2, Link, HelpCircle, CircleDot, Scale } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { calculateWeight, calculateVolumeFromWeight, CalculationParams, CalculationResult, RING_CONE_DEDUCTION_G } from "@/lib/calculations";
import { weightCalculatorSchema, WeightCalculatorFormData } from "@/lib/schema";
import { Material, getMaterials, defaultMaterial } from "@/lib/materials";
import { LossSettings, getLossSettings, ExtraWeightSettings, getExtraWeightSettings } from "@/lib/settings";
import { saveVolumeMm3 } from "@/lib/copyDimensions";
import { ResultCard } from "./ResultCard";
import { MaterialSettings } from "./MaterialSettings";

export function WeightCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [volumeMm3, setVolumeMm3] = useState<number | null>(null);
  const [calcMode, setCalcMode] = useState<"gram-to-volume" | "volume-to-gram">("gram-to-volume");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [lossSettings, setLossSettings] = useState<LossSettings>({ moldFinishingLoss: 0, productionLoss: 0 });
  const [extraWeightSettings, setExtraWeightSettings] = useState<ExtraWeightSettings>(getExtraWeightSettings());
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(defaultMaterial.id);
  const [includeMoldFinishing, setIncludeMoldFinishing] = useState<boolean>(false);
  const [includeNecklaceTip, setIncludeNecklaceTip] = useState<boolean>(false);
  const [includeEarringBack, setIncludeEarringBack] = useState<boolean>(false);
  const [includeBraceletChain, setIncludeBraceletChain] = useState<boolean>(false);
  const [includeRingCone, setIncludeRingCone] = useState<boolean>(false);

  // Client-side'da localStorage'dan yükle
  useEffect(() => {
    setMaterials(getMaterials());
    setLossSettings(getLossSettings());
    setExtraWeightSettings(getExtraWeightSettings());
  }, []);

  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(weightCalculatorSchema),
    defaultValues: {
      volume: undefined as number | undefined,
      targetWeightG: undefined as number | undefined,
      materialDensity: defaultMaterial.density,
      stoneWeight: undefined as number | undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const currentMaterial = materials.find((m) => m.id === selectedMaterialId);
    if (currentMaterial) {
      setValue("materialDensity", currentMaterial.density);
    }
  }, [materials, selectedMaterialId, setValue]);

  const watchedValues = watch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const materialDensity = Number(watchedValues.materialDensity) || 0;
      const stoneWeight = Number(watchedValues.stoneWeight) || 0;

      const baseParams: Omit<CalculationParams, "volume"> = {
        materialDensity,
        infill: 100,
        moldFinishingLoss: includeMoldFinishing ? lossSettings.moldFinishingLoss : 0,
        productionLoss: lossSettings.productionLoss,
        stoneWeight,
        necklaceTipGrams: includeNecklaceTip ? extraWeightSettings.necklaceTipGrams : 0,
        earringBackGrams: includeEarringBack ? extraWeightSettings.earringBackGrams : 0,
        braceletChainGrams: includeBraceletChain ? extraWeightSettings.braceletChainGrams : 0,
        ringConeDeductionG: includeRingCone ? RING_CONE_DEDUCTION_G : 0,
      };

      if (calcMode === "gram-to-volume") {
        const targetWeight = Number(watchedValues.targetWeightG) || 0;
        if (targetWeight > 0 && materialDensity > 0) {
          const calculated = calculateVolumeFromWeight({
            ...baseParams,
            volume: 0,
            targetFinalWeight: targetWeight,
          });
          if (calculated) {
            setResult(calculated);
            setVolumeMm3(calculated.volumeMm3);
            saveVolumeMm3(calculated.volumeMm3);
          } else {
            setResult(null);
            setVolumeMm3(null);
          }
        } else {
          setResult(null);
          setVolumeMm3(null);
        }
      } else {
        const volume = Number(watchedValues.volume) || 0;
        if (volume > 0 && materialDensity > 0) {
          const calculated = calculateWeight({ ...baseParams, volume });
          setResult(calculated);
          setVolumeMm3(null);
          saveVolumeMm3(volume);
        } else {
          setResult(null);
          setVolumeMm3(null);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [watchedValues, lossSettings, extraWeightSettings, includeMoldFinishing, includeNecklaceTip, includeEarringBack, includeBraceletChain, includeRingCone, calcMode]);

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Calculator className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Hesaplama Parametreleri
            </h2>
          </div>

          <div className="flex gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <Button
              type="button"
              variant={calcMode === "gram-to-volume" ? "default" : "ghost"}
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => setCalcMode("gram-to-volume")}
            >
              <Scale className="h-3.5 w-3.5 mr-1" />
              Gram → Hacim
            </Button>
            <Button
              type="button"
              variant={calcMode === "volume-to-gram" ? "default" : "ghost"}
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => setCalcMode("volume-to-gram")}
            >
              <Ruler className="h-3.5 w-3.5 mr-1" />
              Hacim → Gram
            </Button>
          </div>

          {calcMode === "gram-to-volume" ? (
          <div className="space-y-1.5">
            <Label htmlFor="targetWeightG" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Scale className="h-3.5 w-3.5 text-slate-500" />
              Hedef Final Ağırlık (g) <span className="text-red-500">*</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Bitmiş ürünün hedef ağırlığını girin. Taş ve ek parçalar dahil toplam gram.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id="targetWeightG"
              type="number"
              step="0.01"
              placeholder="Örn: 5.50"
              className={`h-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
                errors.targetWeightG ? "border-red-300 dark:border-red-700" : ""
              }`}
              {...register("targetWeightG", { valueAsNumber: true })}
            />
            {errors.targetWeightG && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                <span className="text-red-500">⚠</span>
                {errors.targetWeightG.message}
              </p>
            )}
          </div>
          ) : (
          <div className="space-y-1.5">
            <Label htmlFor="volume" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Ruler className="h-3.5 w-3.5 text-slate-500" />
              Hacim (mm³) <span className="text-red-500">*</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>3D modelinizin hacmini mm³ cinsinden girin. Örnek: 50000 mm³ = 50 cm³</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id="volume"
              type="number"
              step="0.01"
              placeholder="Örn: 50000"
              className={`h-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
                errors.volume ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20 animate-in shake duration-300" : ""
              }`}
              {...register("volume", { valueAsNumber: true })}
            />
            {errors.volume && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="text-red-500">⚠</span>
                {errors.volume.message}
              </p>
            )}
          </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="material" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Settings2 className="h-3.5 w-3.5 text-slate-500" />
              Malzeme <span className="text-red-500">*</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Kullanılacak malzemenin yoğunluğunu seçin. Yoğunluk değerlerini ayarlar menüsünden özelleştirebilirsiniz.</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Controller
              name="materialDensity"
              control={control}
              render={({ field }) => (
                <Select
                  value={selectedMaterialId}
                  onValueChange={(value) => {
                    const material = materials.find((m) => m.id === value);
                    if (material) {
                      setSelectedMaterialId(value);
                      setValue("materialDensity", material.density);
                    }
                  }}
                >
                  <SelectTrigger className={`h-10 w-full border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
                    errors.materialDensity ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}>
                    <SelectValue placeholder="Malzeme seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.materialDensity && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="text-red-500">⚠</span>
                {errors.materialDensity.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stoneWeight" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Gem className="h-3.5 w-3.5 text-slate-500" />
              Taş Ağırlığı (g)
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Ürüne eklenecek taşların toplam ağırlığını gram cinsinden girin. Örnek: 2.5 g</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id="stoneWeight"
              type="number"
              step="0.01"
              min="0"
              placeholder="Örn: 2.5"
              className={`h-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
                errors.stoneWeight ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20" : ""
              }`}
              {...register("stoneWeight", { valueAsNumber: true })}
            />
            {errors.stoneWeight && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="text-red-500">⚠</span>
                {errors.stoneWeight.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Link className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="necklaceTip" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Kolye Tepeliği
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Kolye tepeliği ekleniyorsa açın. Ayarlardan gram değerini değiştirebilirsiniz.</p>
                    </TooltipContent>
                  </Tooltip>
                  {includeNecklaceTip && (
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
                      +{extraWeightSettings.necklaceTipGrams.toFixed(2)} g
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {includeNecklaceTip ? "Hesaba dahil" : "Hesaba dahil değil"}
                </p>
              </div>
            </div>
            <Switch
              id="necklaceTip"
              checked={includeNecklaceTip}
              onCheckedChange={setIncludeNecklaceTip}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Gem className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="earringBack" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Küpe Çivi/Kelebek
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Küpe çivi veya kelebek ekleniyorsa açın. Ayarlardan gram değerini değiştirebilirsiniz.</p>
                    </TooltipContent>
                  </Tooltip>
                  {includeEarringBack && (
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold">
                      +{extraWeightSettings.earringBackGrams.toFixed(2)} g
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {includeEarringBack ? "Hesaba dahil" : "Hesaba dahil değil"}
                </p>
              </div>
            </div>
            <Switch
              id="earringBack"
              checked={includeEarringBack}
              onCheckedChange={setIncludeEarringBack}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Link className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="braceletChain" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Bileklik Zinciri
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Bileklik zinciri ekleniyorsa açın. Ayarlardan gram değerini değiştirebilirsiniz.</p>
                    </TooltipContent>
                  </Tooltip>
                  {includeBraceletChain && (
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
                      +{extraWeightSettings.braceletChainGrams.toFixed(2)} g
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {includeBraceletChain ? "Hesaba dahil" : "Hesaba dahil değil"}
                </p>
              </div>
            </div>
            <Switch
              id="braceletChain"
              checked={includeBraceletChain}
              onCheckedChange={setIncludeBraceletChain}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <CircleDot className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="ringCone" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Yüzük Koçanı
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Açıksa final ağırlıktan 0,06 g düşülür (yüzük koçanı boşluğu).</p>
                    </TooltipContent>
                  </Tooltip>
                  {includeRingCone && (
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                      −{RING_CONE_DEDUCTION_G.toFixed(2)} g
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {includeRingCone ? "Hesaba dahil" : "Hesaba dahil değil"}
                </p>
              </div>
            </div>
            <Switch
              id="ringCone"
              checked={includeRingCone}
              onCheckedChange={setIncludeRingCone}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Settings2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="moldFinishing" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Kalıp Tesviye Kayıpları
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Kalıp tesviye işlemi sırasında oluşan kayıpları hesaba dahil etmek için açın. Yüzde değerini ayarlar menüsünden belirleyebilirsiniz.</p>
                    </TooltipContent>
                  </Tooltip>
                  {includeMoldFinishing && (
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
                      {lossSettings.moldFinishingLoss}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {includeMoldFinishing ? "Hesaba dahil" : "Hesaba dahil değil"}
                </p>
              </div>
            </div>
            <Switch
              id="moldFinishing"
              checked={includeMoldFinishing}
              onCheckedChange={setIncludeMoldFinishing}
            />
          </div>
        </CardContent>
      </Card>

      <div className="lg:sticky lg:top-4 lg:h-fit">
        <ResultCard
          result={result}
          reverseMode={calcMode === "gram-to-volume"}
          volumeMm3={volumeMm3 ?? undefined}
          showMoldFinishing={includeMoldFinishing}
          showNecklaceTip={includeNecklaceTip}
          showEarringBack={includeEarringBack}
          necklaceTipGrams={extraWeightSettings.necklaceTipGrams}
          earringBackGrams={extraWeightSettings.earringBackGrams}
          showBraceletChain={includeBraceletChain}
          braceletChainGrams={extraWeightSettings.braceletChainGrams}
        />
      </div>
      </div>

      <div className="flex justify-center">
        <MaterialSettings
          onMaterialsChange={setMaterials}
          onLossSettingsChange={setLossSettings}
          onExtraWeightSettingsChange={setExtraWeightSettings}
        />
      </div>
      </div>
    </TooltipProvider>
  );
}

