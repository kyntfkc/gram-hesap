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
} from "@/lib/settings";
import { Settings } from "lucide-react";

interface MaterialSettingsProps {
  onMaterialsChange: (materials: Material[]) => void;
  onLossSettingsChange: (settings: LossSettings) => void;
}

export function MaterialSettings({
  onMaterialsChange,
  onLossSettingsChange,
}: MaterialSettingsProps) {
  const [materials, setMaterials] = useState<Material[]>(() => getMaterials());
  const [lossSettings, setLossSettings] = useState<LossSettings>(() => getLossSettings());
  const [lossInputs, setLossInputs] = useState<{ [key: string]: string }>(() => ({
    moldFinishingLoss: getLossSettings().moldFinishingLoss.toString(),
    productionLoss: getLossSettings().productionLoss.toString(),
  }));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onMaterialsChange(materials);
    onLossSettingsChange(lossSettings);
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

  const handleReset = () => {
    const resetMat = resetMaterials();
    const resetLoss = resetLossSettings();
    setMaterials(resetMat);
    setLossSettings(resetLoss);
    setLossInputs({
      moldFinishingLoss: resetLoss.moldFinishingLoss.toString(),
      productionLoss: resetLoss.productionLoss.toString(),
    });
    onMaterialsChange(resetMat);
    onLossSettingsChange(resetLoss);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md">
          <Settings className="h-4 w-4" />
          Ayarlar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">Ayarlar</DialogTitle>
          <DialogDescription className="text-sm">
            Malzeme yoğunlukları ve kayıp değerlerini özelleştirebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Malzeme Yoğunlukları (g/cm³)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Kayıp Değerleri (%)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
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
            </CardContent>
          </Card>

          <div className="flex justify-end pt-1">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Tümünü Varsayılana Dön
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

