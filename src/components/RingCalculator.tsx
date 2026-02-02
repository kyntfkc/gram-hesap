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
              Yüzük Boy Hesaplayıcı
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

          {parseFloat(referenceWeight) > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                <Gem className="h-4 w-4 text-blue-500" />
                Hesaplanan Yüzük Boyları
              </h3>
              <div className="space-y-4">
                {results.map((group) => (
                  <div
                    key={group.groupName}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800/50"
                  >
                    <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                          {group.groupName} ({group.sizes[0]}-{group.sizes[group.sizes.length - 1]} ölçü)
                        </h4>
                        {parseFloat(referencePrice) > 0 && (
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {group.groupName === "Küçük Grup" && `%${ringGroupPriceSettings.smallGroupDiscount} indirim`}
                            {group.groupName === "Orta Grup" && "Değişiklik yok"}
                            {group.groupName === "Büyük Grup" && `%${ringGroupPriceSettings.largeGroupSurcharge} ek ücret`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`grid ${parseFloat(referencePrice) > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-4 px-4 py-2 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-700/20 border-b border-slate-200 dark:border-slate-700`}>
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Boy
                      </div>
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">
                        Gram
                      </div>
                      {parseFloat(referencePrice) > 0 && (
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">
                          Fiyat
                        </div>
                      )}
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                      {group.results.map((result) => (
                        <div
                          key={result.size}
                          className={`grid ${parseFloat(referencePrice) > 0 ? 'grid-cols-3' : 'grid-cols-2'} gap-4 px-4 py-3 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/30`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {result.size} Numara
                            </span>
                          </div>
                          <div className="text-right text-sm font-bold text-slate-900 dark:text-slate-50">
                            {result.weight.toFixed(2)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">g</span>
                          </div>
                          {parseFloat(referencePrice) > 0 && (
                            <div className="text-right text-sm font-bold text-slate-900 dark:text-slate-50">
                              ₺{result.price.toFixed(2)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!referenceWeight || parseFloat(referenceWeight) <= 0) && (
            <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Referans gram değerini girin, tüm boylar otomatik hesaplanacak
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                İsteğe bağlı olarak referans fiyat da girebilirsiniz
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

