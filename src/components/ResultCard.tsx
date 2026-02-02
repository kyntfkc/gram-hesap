import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult } from "@/lib/calculations";
import { TrendingUp, Scale, Sparkles, CheckCircle2 } from "lucide-react";

interface ResultCardProps {
  result: CalculationResult | null;
}

export function ResultCard({ result }: ResultCardProps) {
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
    <Card className="w-full border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-b border-slate-200/50 dark:border-slate-700/50 py-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg animate-in zoom-in duration-300">
            <TrendingUp className="h-4 w-4" />
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 bg-clip-text text-transparent">
            Hesaplama Sonuçları
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="grid gap-2">
          <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all animate-in fade-in slide-in-from-left duration-300 delay-75">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Scale className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Temel Ağırlık</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-50">{result.baseWeight.toFixed(2)} g</span>
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all animate-in fade-in slide-in-from-left duration-300 delay-150">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Kalıp Tesviye Sonrası</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-50">{result.afterMoldFinishing.toFixed(2)} g</span>
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all animate-in fade-in slide-in-from-left duration-300 delay-225">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Üretim Kayıpları Sonrası</span>
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-slate-50">{result.afterProductionLoss.toFixed(2)} g</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg animate-in fade-in zoom-in duration-500 delay-300">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-50">Final Ağırlık</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {result.finalWeight.toFixed(2)} g
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

