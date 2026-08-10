import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult } from "@/lib/calculations";
import { formatInt, formatGram } from "@/lib/copyDimensions";
import { CopyDimensionButton } from "@/components/CopyDimensionButton";
import { TrendingUp, Scale, Sparkles, CheckCircle2, Link, Gem, Ruler } from "lucide-react";

interface ResultCardProps {
  result: CalculationResult | null;
  /** Gram → Hacim modunda hesaplanan hacim */
  volumeMm3?: number;
  reverseMode?: boolean;
  /** Sol taraftaki "Kalıp Tesviye Kayıpları" toggle açıksa sağda bu satır gösterilir */
  showMoldFinishing?: boolean;
  /** Sol taraftaki "Kolye Tepeliği" toggle açıksa sağda gösterilir */
  showNecklaceTip?: boolean;
  /** Sol taraftaki "Küpe Çivi/Kelebek" toggle açıksa sağda gösterilir */
  showEarringBack?: boolean;
  /** Sol taraftaki "Bileklik Zinciri" toggle açıksa sağda gösterilir */
  showBraceletChain?: boolean;
  /** Sol taraftaki "Kolye Zinciri" toggle açıksa sağda gösterilir */
  showPendantChain?: boolean;
  /** Ayarlardan gelen gram değerleri (gösterim için) */
  necklaceTipGrams?: number;
  earringBackGrams?: number;
  braceletChainGrams?: number;
  pendantChainGrams?: number;
}

export function ResultCard({ result, volumeMm3, reverseMode = false, showMoldFinishing = false, showNecklaceTip = false, showEarringBack = false, showBraceletChain = false, showPendantChain = false, necklaceTipGrams = 0.12, earringBackGrams = 0.4, braceletChainGrams = 0.75, pendantChainGrams = 1.05 }: ResultCardProps) {
  if (!result) {
    return (
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
    );
  }

  return (
    <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-xl overflow-hidden animate-in fade-in duration-200 py-0 gap-0">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-b border-slate-200/50 dark:border-slate-700/50 py-2.5 px-4 [.border-b]:pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <TrendingUp className="h-4 w-4" />
          </div>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 bg-clip-text text-transparent">
            Hesaplama Sonuçları
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-3">
        <div className="grid gap-1.5">
          <div className="flex justify-between items-center p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Scale className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Temel Ağırlık</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-50">{formatGram(result.baseWeight)} g</span>
          </div>
          
          {showMoldFinishing && (
          <div className="flex justify-between items-center p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kalıp Tesviye Sonrası</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-50">{formatGram(result.afterMoldFinishing)} g</span>
          </div>
          )}
          
          <div className="flex justify-between items-center p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Üretim Kayıpları Sonrası</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-50">{formatGram(result.afterProductionLoss)} g</span>
          </div>

          {showNecklaceTip && (
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Link className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kolye Tepeliği</span>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-50">+{formatGram(necklaceTipGrams)} g</span>
            </div>
          )}

          {showPendantChain && (
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Link className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kolye Zinciri</span>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-50">+{formatGram(pendantChainGrams)} g</span>
            </div>
          )}

          {showBraceletChain && (
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Link className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Bileklik Zinciri</span>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-50">+{formatGram(braceletChainGrams)} g</span>
            </div>
          )}

          {showEarringBack && (
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Gem className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Küpe Çivi/Kelebek</span>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-50">+{formatGram(earringBackGrams)} g</span>
            </div>
          )}
        </div>
        
        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                {reverseMode ? <Ruler className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                {reverseMode ? "Gerekli Hacim" : "Final Ağırlık"}
              </span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {reverseMode && volumeMm3 != null
                ? `${formatInt(volumeMm3)} mm³`
                : `${formatGram(result.finalWeight)} g`}
            </span>
          </div>
          <CopyDimensionButton type="volume" />
        </div>
      </CardContent>
    </Card>
  );
}

