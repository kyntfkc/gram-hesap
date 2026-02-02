"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gem, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { calculateRingWeights, REFERENCE_SIZE } from "@/lib/ringCalculations";
import { getRingGroupPriceSettings, RingGroupPriceSettings } from "@/lib/settings";
import { MaterialSettings } from "./MaterialSettings";

export function RingCalculator() {
  const [referenceWeight, setReferenceWeight] = useState<string>("");
  const [referencePrice, setReferencePrice] = useState<string>("");
  const [ringGroupPriceSettings, setRingGroupPriceSettings] = useState<RingGroupPriceSettings>(
    getRingGroupPriceSettings()
  );
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    "Küçük Grup": false,
    "Orta Grup": false,
    "Büyük Grup": false,
  });

  useEffect(() => {
    setRingGroupPriceSettings(getRingGroupPriceSettings());
  }, []);

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

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
                      bg: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
                      border: "border-blue-200 dark:border-blue-800",
                      header: "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800/40 dark:to-indigo-800/40",
                      text: "text-blue-700 dark:text-blue-300",
                    },
                    "Orta Grup": {
                      bg: "from-slate-50 to-gray-50 dark:from-slate-800/30 dark:to-gray-800/30",
                      border: "border-slate-200 dark:border-slate-700",
                      header: "bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-700/50 dark:to-gray-700/50",
                      text: "text-slate-700 dark:text-slate-300",
                    },
                    "Büyük Grup": {
                      bg: "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
                      border: "border-purple-200 dark:border-purple-800",
                      header: "bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-800/40 dark:to-violet-800/40",
                      text: "text-purple-700 dark:text-purple-300",
                    },
                  };
                  const colors = groupColors[group.groupName as keyof typeof groupColors] || groupColors["Orta Grup"];
                  const isOpen = openGroups[group.groupName];
                  const groupPrice = group.results[0]?.price || 0;
                  
                  return (
                    <div
                      key={group.groupName}
                      className={`rounded-lg border ${colors.border} overflow-hidden bg-gradient-to-br ${colors.bg} transition-all`}
                    >
                      <button
                        onClick={() => toggleGroup(group.groupName)}
                        className={`w-full px-3 py-2.5 ${colors.header} border-b ${colors.border} flex items-center justify-between hover:opacity-90 transition-all`}
                      >
                        <div className="flex items-center gap-2">
                          {isOpen ? (
                            <ChevronUp className={`h-4 w-4 ${colors.text}`} />
                          ) : (
                            <ChevronDown className={`h-4 w-4 ${colors.text}`} />
                          )}
                          <h4 className={`text-xs font-bold ${colors.text}`}>
                            {group.groupName} ({group.sizes[0]}-{group.sizes[group.sizes.length - 1]} ölçü)
                          </h4>
                          {parseFloat(referencePrice) > 0 && (
                            <span className={`text-xs font-semibold ${colors.text} ml-2`}>
                              {group.groupName === "Küçük Grup" && `%${ringGroupPriceSettings.smallGroupDiscount} indirim`}
                              {group.groupName === "Orta Grup" && "Değişiklik yok"}
                              {group.groupName === "Büyük Grup" && `%${ringGroupPriceSettings.largeGroupSurcharge} ek ücret`}
                            </span>
                          )}
                        </div>
                        {parseFloat(referencePrice) > 0 && (
                          <div className={`text-sm font-bold ${colors.text}`}>
                            ₺{groupPrice.toFixed(2)}
                          </div>
                        )}
                      </button>
                      {isOpen && (
                        <>
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
                        </>
                      )}
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

