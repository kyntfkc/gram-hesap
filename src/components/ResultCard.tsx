import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult } from "@/lib/calculations";
import { formatInt, formatGram } from "@/lib/copyDimensions";
import { CopyDimensionButton } from "@/components/CopyDimensionButton";
import { TrendingUp, Scale, CheckCircle2, Ruler } from "lucide-react";

interface ResultCardProps {
  result: CalculationResult | null;
  volumeMm3?: number;
  reverseMode?: boolean;
  showMoldFinishing?: boolean;
  showNecklaceTip?: boolean;
  showEarringBack?: boolean;
  showBraceletChain?: boolean;
  showPendantChain?: boolean;
  necklaceTipGrams?: number;
  earringBackGrams?: number;
  braceletChainGrams?: number;
  pendantChainGrams?: number;
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200/50 bg-slate-50/80 px-2.5 py-1.5 dark:border-slate-700/50 dark:bg-slate-800/40">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-slate-50"}`}>
        {value}
      </span>
    </div>
  );
}

export function ResultCard({
  result,
  volumeMm3,
  reverseMode = false,
  showMoldFinishing = false,
  showNecklaceTip = false,
  showEarringBack = false,
  showBraceletChain = false,
  showPendantChain = false,
  necklaceTipGrams = 0.12,
  earringBackGrams = 0.4,
  braceletChainGrams = 0.75,
  pendantChainGrams = 1.05,
}: ResultCardProps) {
  if (!result) {
    return (
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
    );
  }

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/50 shadow-xl backdrop-blur-xl dark:from-slate-900 dark:to-slate-800/50">
      <CardHeader className="border-b border-slate-200/50 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-3 py-2 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 p-1 text-white">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-50">Sonuçlar</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 p-3">
        <Row label="Temel Ağırlık" value={`${formatGram(result.baseWeight)} g`} />
        {showMoldFinishing && (
          <Row label="Kalıp Tesviye Sonrası" value={`${formatGram(result.afterMoldFinishing)} g`} />
        )}
        <Row label="Üretim Kayıpları Sonrası" value={`${formatGram(result.afterProductionLoss)} g`} />
        {showNecklaceTip && <Row label="Kolye Tepeliği" value={`+${formatGram(necklaceTipGrams)} g`} accent />}
        {showPendantChain && <Row label="Kolye Zinciri" value={`+${formatGram(pendantChainGrams)} g`} accent />}
        {showBraceletChain && <Row label="Bileklik Zinciri" value={`+${formatGram(braceletChainGrams)} g`} accent />}
        {showEarringBack && <Row label="Küpe Çivi/Kelebek" value={`+${formatGram(earringBackGrams)} g`} accent />}

        <div className="mt-1 flex items-center justify-between rounded-xl border-2 border-blue-200/50 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-3 py-2.5 dark:border-blue-800/50">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 text-white">
              {reverseMode ? <Ruler className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
              {reverseMode ? "Gerekli Hacim" : "Final Ağırlık"}
            </span>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold tabular-nums text-transparent dark:from-blue-400 dark:to-indigo-400">
            {reverseMode && volumeMm3 != null
              ? `${formatInt(volumeMm3)} mm³`
              : `${formatGram(result.finalWeight)} g`}
          </span>
        </div>
        <CopyDimensionButton type="volume" />
      </CardContent>
    </Card>
  );
}
