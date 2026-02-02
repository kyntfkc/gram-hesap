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
import { Calculator, Ruler, Gem, Settings2, Link } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { calculateWeight, CalculationParams, CalculationResult } from "@/lib/calculations";
import { weightCalculatorSchema, WeightCalculatorFormData } from "@/lib/schema";
import { Material, getMaterials, defaultMaterial } from "@/lib/materials";
import { LossSettings, getLossSettings } from "@/lib/settings";
import { ResultCard } from "./ResultCard";
import { MaterialSettings } from "./MaterialSettings";

export function WeightCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [lossSettings, setLossSettings] = useState<LossSettings>({ moldFinishingLoss: 0, productionLoss: 0 });
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(defaultMaterial.id);
  const [includeMoldFinishing, setIncludeMoldFinishing] = useState<boolean>(false);
  const [includeNecklaceTip, setIncludeNecklaceTip] = useState<boolean>(false);
  const [includeEarringBack, setIncludeEarringBack] = useState<boolean>(false);

  // Client-side'da localStorage'dan yükle
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
  } = useForm({
    resolver: zodResolver(weightCalculatorSchema),
    defaultValues: {
      volume: undefined as number | undefined,
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
      const volume = Number(watchedValues.volume) || 0;
      const materialDensity = Number(watchedValues.materialDensity) || 0;
      const stoneWeight = Number(watchedValues.stoneWeight) || 0;

      if (volume > 0 && materialDensity > 0) {
        const params: CalculationParams = {
          volume,
          materialDensity,
          infill: 100, // Her zaman %100
          moldFinishingLoss: includeMoldFinishing ? lossSettings.moldFinishingLoss : 0,
          productionLoss: lossSettings.productionLoss,
          stoneWeight,
          necklaceTip: includeNecklaceTip,
          earringBack: includeEarringBack,
        };
        const calculated = calculateWeight(params);
        setResult(calculated);
      } else {
        setResult(null);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [watchedValues, lossSettings, includeMoldFinishing, includeNecklaceTip, includeEarringBack]);

  return (
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

          <div className="space-y-1.5">
            <Label htmlFor="volume" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Ruler className="h-3.5 w-3.5 text-slate-500" />
              Hacim (mm³) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="volume"
              type="number"
              step="0.01"
              placeholder="Örn: 50000"
              className="h-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              {...register("volume", { valueAsNumber: true })}
            />
            {errors.volume && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                {errors.volume.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="material" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Settings2 className="h-3.5 w-3.5 text-slate-500" />
              Malzeme <span className="text-red-500">*</span>
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
                  <SelectTrigger className="h-10 w-full border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20">
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
              <p className="text-sm text-red-500 font-medium">{errors.materialDensity.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stoneWeight" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Gem className="h-3.5 w-3.5 text-slate-500" />
              Taş Ağırlığı (g)
            </Label>
            <Input
              id="stoneWeight"
              type="number"
              step="0.01"
              min="0"
              placeholder="Örn: 2.5"
              className="h-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              {...register("stoneWeight", { valueAsNumber: true })}
            />
            {errors.stoneWeight && (
              <p className="text-sm text-red-500 font-medium">{errors.stoneWeight.message}</p>
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
                  {includeNecklaceTip && (
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
                      +0.15 g
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
                  {includeEarringBack && (
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold">
                      +0.40 g
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
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Settings2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="moldFinishing" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Kalıp Tesviye Kayıpları
                  </Label>
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
        <ResultCard result={result} />
      </div>
      </div>

      <div className="flex justify-center">
        <MaterialSettings
          onMaterialsChange={setMaterials}
          onLossSettingsChange={setLossSettings}
        />
      </div>
    </div>
  );
}

