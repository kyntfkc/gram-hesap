"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gem, DollarSign } from "lucide-react";
import { calculateRingWeights, REFERENCE_SIZE } from "@/lib/ringCalculations";
import { getRingGroupPriceSettings, RingGroupPriceSettings } from "@/lib/settings";
import { MaterialSettings } from "./MaterialSettings";

export function RingCalculator() {
  const [referenceWeight, setReferenceWeight] = useState<string>("");
  const [referencePrice, setReferencePrice] = useState<string>("");
  const [ringGroupPriceSettings, setRingGroupPriceSettings] = useState<RingGroupPriceSettings>(
    getRingGroupPriceSettings()
  );

  useEffect(() => {
    setRingGroupPriceSettings(getRingGroupPriceSettings());
  }, []);

  const results = calculateRingWeights(
    parseFloat(referenceWeight) || 0,
    parseFloat(referencePrice) || 0,
    ringGroupPriceSettings
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Gem className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Varyant Fiyat Hesaplayıcı
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="referenceWeight" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Gem className="h-3.5 w-3.5 text-slate-500" />
                Referans Gram ({REFERENCE_SIZE} Numara)
              </Label>
              <Input
                id="referenceWeight"
                type="number"
                step="0.01"
                placeholder="Örn: 5.0"
                className="h-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                value={referenceWeight}
                onChange={(e) => setReferenceWeight(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="referencePrice" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                Referans Fiyat ({REFERENCE_SIZE} Numara)
              </Label>
              <Input
                id="referencePrice"
                type="number"
                step="0.01"
                placeholder="Örn: 1000"
                className="h-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                value={referencePrice}
                onChange={(e) => setReferencePrice(e.target.value)}
              />
            </div>
          </div>

          {(parseFloat(referenceWeight) > 0 || parseFloat(referencePrice) > 0) && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                <Gem className="h-4 w-4 text-blue-500" />
                Hesaplanan Varyantlar
              </h3>
              <div className="space-y-3">
                {results.map((group, index) => {
                  const groupColors = {
                    "Küçük Grup": {
                      bg: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
                      border: "border-emerald-200 dark:border-emerald-800",
                      header: "bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800/40 dark:to-teal-800/40",
                      text: "text-emerald-700 dark:text-emerald-300",
                    },
                    "Orta Grup": {
                      bg: "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
                      border: "border-amber-200 dark:border-amber-800",
                      header: "bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-800/40 dark:to-yellow-800/40",
                      text: "text-amber-700 dark:text-amber-300",
                    },
                    "Büyük Grup": {
                      bg: "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
                      border: "border-rose-200 dark:border-rose-800",
                      header: "bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-800/40 dark:to-pink-800/40",
                      text: "text-rose-700 dark:text-rose-300",
                    },
                  };
                  const colors = groupColors[group.groupName as keyof typeof groupColors] || groupColors["Orta Grup"];
                  
                  return (
                    <div
                      key={group.groupName}
                      className={`rounded-lg border-2 ${colors.border} overflow-hidden bg-gradient-to-br ${colors.bg}`}
                    >
                      <div className={`px-3 py-2 ${colors.header} border-b ${colors.border}`}>
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${colors.text}`}>
                            {group.groupName} ({group.sizes[0]}-{group.sizes[group.sizes.length - 1]} ölçü)
                          </h4>
                          {parseFloat(referencePrice) > 0 && (
                            <span className={`text-xs font-semibold ${colors.text}`}>
                              {group.groupName === "Küçük Grup" && `%${ringGroupPriceSettings.smallGroupDiscount} indirim`}
                              {group.groupName === "Orta Grup" && "Değişiklik yok"}
                              {group.groupName === "Büyük Grup" && `%${ringGroupPriceSettings.largeGroupSurcharge} ek ücret`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`grid ${parseFloat(referencePrice) > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-3 px-3 py-1.5 bg-white/30 dark:bg-slate-800/20 border-b ${colors.border}`}>
                        <div className={`text-xs font-bold ${colors.text} uppercase tracking-wider`}>
                          Boy
                        </div>
                        <div className={`text-xs font-bold ${colors.text} uppercase tracking-wider text-right`}>
                          Gram
                        </div>
                        {parseFloat(referencePrice) > 0 && (
                          <div className={`text-xs font-bold ${colors.text} uppercase tracking-wider text-right`}>
                            Fiyat
                          </div>
                        )}
                      </div>
                      <div className={`divide-y ${colors.border}`}>
                        {group.results.map((result) => (
                          <div
                            key={result.size}
                            className={`grid ${parseFloat(referencePrice) > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-3 px-3 py-2 transition-all hover:bg-white/50 dark:hover:bg-slate-800/30`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                                {result.size} Numara
                              </span>
                            </div>
                            <div className="text-right text-xs font-bold text-slate-900 dark:text-slate-50">
                              {result.weight.toFixed(2)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">g</span>
                            </div>
                            {parseFloat(referencePrice) > 0 && (
                              <div className="text-right text-xs font-bold text-slate-900 dark:text-slate-50">
                                ₺{result.price.toFixed(2)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(!referenceWeight || parseFloat(referenceWeight) <= 0) && (!referencePrice || parseFloat(referencePrice) <= 0) && (
            <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Referans gram veya fiyat değerini girin, tüm boylar otomatik hesaplanacak
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Gram veya fiyat değerlerinden en az birini girmeniz gerekiyor
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <MaterialSettings
          onMaterialsChange={() => {}}
          onLossSettingsChange={() => {}}
          onRingGroupPriceSettingsChange={(settings) => {
            setRingGroupPriceSettings(settings);
          }}
        />
      </div>
    </div>
  );
}

