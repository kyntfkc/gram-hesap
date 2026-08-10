"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Material, getMaterials, saveMaterials, resetMaterials, defaultMaterials } from "@/lib/materials";
import {
  LossSettings,
  getLossSettings,
  saveLossSettings,
  resetLossSettings,
  defaultLossSettings,
  ExtraWeightSettings,
  getExtraWeightSettings,
  saveExtraWeightSettings,
  resetExtraWeightSettings,
  defaultExtraWeightSettings,
} from "@/lib/settings";
import { Settings, Database, TrendingDown, RotateCcw, Link } from "lucide-react";

interface MaterialSettingsProps {
  onMaterialsChange: (materials: Material[]) => void;
  onLossSettingsChange: (settings: LossSettings) => void;
  onExtraWeightSettingsChange?: (settings: ExtraWeightSettings) => void;
}

export function MaterialSettings({
  onMaterialsChange,
  onLossSettingsChange,
  onExtraWeightSettingsChange,
}: MaterialSettingsProps) {
  const [materials, setMaterials] = useState<Material[]>(() => getMaterials());
  const [lossSettings, setLossSettings] = useState<LossSettings>(() => getLossSettings());
  const [lossInputs, setLossInputs] = useState<{ [key: string]: string }>(() => ({
    moldFinishingLoss: getLossSettings().moldFinishingLoss.toString(),
    productionLoss: getLossSettings().productionLoss.toString(),
  }));
  const [extraWeightSettings, setExtraWeightSettings] = useState<ExtraWeightSettings>(() => getExtraWeightSettings());
  const [extraWeightInputs, setExtraWeightInputs] = useState<{ [key: string]: string }>(() => ({
    necklaceTipGrams: getExtraWeightSettings().necklaceTipGrams.toString(),
    earringBackGrams: getExtraWeightSettings().earringBackGrams.toString(),
    braceletChainGrams: getExtraWeightSettings().braceletChainGrams.toString(),
  }));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onMaterialsChange(materials);
    onLossSettingsChange(lossSettings);
    if (onExtraWeightSettingsChange) onExtraWeightSettingsChange(extraWeightSettings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDensityChange = (id: string, density: number) => {
    const updated = materials.map((m) =>
      m.id === id ? { ...m, density: Math.max(0, density) } : m
    );
    setMaterials(updated);
    saveMaterials(updated);
    onMaterialsChange(updated);
  };

  const handleLossInputChange = (key: keyof LossSettings, value: string) => {
    // Input değerini güncelle (kullanıcı yazarken)
    setLossInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLossBlur = (key: keyof LossSettings) => {
    const inputValue = lossInputs[key];
    // Boş veya geçersiz ise 0 olarak ayarla
    const numValue = inputValue === "" || inputValue === "-" ? 0 : parseFloat(inputValue);
    const finalValue = isNaN(numValue) ? 0 : Math.max(0, Math.min(100, numValue));
    
    const updated = {
      ...lossSettings,
      [key]: finalValue,
    };
    setLossSettings(updated);
    saveLossSettings(updated);
    onLossSettingsChange(updated);
    
    // Input değerini de güncelle
    setLossInputs((prev) => ({
      ...prev,
      [key]: finalValue.toString(),
    }));
  };

  const handleExtraWeightInputChange = (key: keyof ExtraWeightSettings, value: string) => {
    setExtraWeightInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleExtraWeightBlur = (key: keyof ExtraWeightSettings) => {
    const inputValue = extraWeightInputs[key];
    const numValue = inputValue === "" || inputValue === "-" ? 0 : parseFloat(inputValue);
    const finalValue = isNaN(numValue) ? 0 : Math.max(0, numValue);
    const updated = { ...extraWeightSettings, [key]: finalValue };
    setExtraWeightSettings(updated);
    saveExtraWeightSettings(updated);
    if (onExtraWeightSettingsChange) onExtraWeightSettingsChange(updated);
    setExtraWeightInputs((prev) => ({ ...prev, [key]: finalValue.toString() }));
  };

  const handleReset = () => {
    const resetMat = resetMaterials();
    const resetLoss = resetLossSettings();
    const resetExtra = resetExtraWeightSettings();
    setMaterials(resetMat);
    setLossSettings(resetLoss);
    setLossInputs({
      moldFinishingLoss: resetLoss.moldFinishingLoss.toString(),
      productionLoss: resetLoss.productionLoss.toString(),
    });
    setExtraWeightSettings(resetExtra);
    setExtraWeightInputs({
      necklaceTipGrams: resetExtra.necklaceTipGrams.toString(),
      earringBackGrams: resetExtra.earringBackGrams.toString(),
      braceletChainGrams: resetExtra.braceletChainGrams.toString(),
    });
    onMaterialsChange(resetMat);
    onLossSettingsChange(resetLoss);
    if (onExtraWeightSettingsChange) onExtraWeightSettingsChange(resetExtra);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md">
          <Settings className="h-4 w-4" />
          Ayarlar
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[61vw] max-w-[61vw] sm:max-w-[61vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Settings className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl font-bold">Ayarlar</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Malzeme yoğunlukları, kayıp değerleri ve ek ağırlık gramlarını özelleştirebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <Database className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-base font-semibold">Malzeme Yoğunlukları (g/cm³)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-1 gap-3">
                  {materials.map((material) => (
                    <div key={material.id} className="space-y-1.5">
                      <Label htmlFor={material.id} className="text-sm font-medium">
                        {material.name}
                      </Label>
                      <Input
                        id={material.id}
                        type="number"
                        step="0.01"
                        min="0"
                        value={material.density}
                        onChange={(e) =>
                          handleDensityChange(material.id, parseFloat(e.target.value) || 0)
                        }
                        className="h-9"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-900/30">
                    <TrendingDown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-base font-semibold">Kayıp Değerleri (%)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="moldFinishingLoss" className="text-sm font-medium">
                      Kalıp Tesviye Kayıpları
                    </Label>
                    <Input
                      id="moldFinishingLoss"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={lossInputs.moldFinishingLoss}
                      onChange={(e) =>
                        handleLossInputChange("moldFinishingLoss", e.target.value)
                      }
                      onBlur={() => handleLossBlur("moldFinishingLoss")}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="productionLoss" className="text-sm font-medium">
                      Üretim Kayıpları
                    </Label>
                    <Input
                      id="productionLoss"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={lossInputs.productionLoss}
                      onChange={(e) =>
                        handleLossInputChange("productionLoss", e.target.value)
                      }
                      onBlur={() => handleLossBlur("productionLoss")}
                      className="h-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30">
                    <Link className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-base font-semibold">Ek Ağırlıklar (g)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="necklaceTipGrams" className="text-sm font-medium">
                      Kolye Tepeliği (g)
                    </Label>
                    <Input
                      id="necklaceTipGrams"
                      type="number"
                      step="0.01"
                      min="0"
                      value={extraWeightInputs.necklaceTipGrams}
                      onChange={(e) => handleExtraWeightInputChange("necklaceTipGrams", e.target.value)}
                      onBlur={() => handleExtraWeightBlur("necklaceTipGrams")}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="earringBackGrams" className="text-sm font-medium">
                      Küpe Çivi/Kelebek (g)
                    </Label>
                    <Input
                      id="earringBackGrams"
                      type="number"
                      step="0.01"
                      min="0"
                      value={extraWeightInputs.earringBackGrams}
                      onChange={(e) => handleExtraWeightInputChange("earringBackGrams", e.target.value)}
                      onBlur={() => handleExtraWeightBlur("earringBackGrams")}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="braceletChainGrams" className="text-sm font-medium">
                      Bileklik Zinciri (g)
                    </Label>
                    <Input
                      id="braceletChainGrams"
                      type="number"
                      step="0.01"
                      min="0"
                      value={extraWeightInputs.braceletChainGrams}
                      onChange={(e) => handleExtraWeightInputChange("braceletChainGrams", e.target.value)}
                      onBlur={() => handleExtraWeightBlur("braceletChainGrams")}
                      className="h-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Tümünü Varsayılana Dön
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

