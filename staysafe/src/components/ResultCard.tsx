// ResultCard.tsx
import clsx from "clsx";
import { AnalysisResult } from "@/library/types";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

export function ResultCard({ result }: { result: AnalysisResult }) {
  const statusConfig = {
    legal: {
      icon: <CheckCircle2 className="h-6 w-6" />,
      card: "bg-green-900/50 border-green-700 text-green-200",
      header: "text-green-300",
    },
    prohibited: {
      icon: <XCircle className="h-6 w-6" />,
      card: "bg-red-900/50 border-red-700 text-red-200",
      header: "text-red-300",
    },
    uncertain: {
      icon: <AlertTriangle className="h-6 w-6" />,
      card: "bg-yellow-900/50 border-yellow-700 text-yellow-200",
      header: "text-yellow-300",
    },
  };

  const config = statusConfig[result.status];

  return (
    <div className={clsx("p-5 rounded-lg border w-full text-left", config.card)}>
      {/* Product Name */}
      <p className="font-semibold text-lg text-white/90">{result.product.name}</p>

      {/* Status */}
      <div className="flex items-center gap-3 mt-3">
        <span className={config.header}>{config.icon}</span>
        <p className={`text-xl font-bold ${config.header}`}>
          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
        </p>
      </div>

      {/* Reason */}
      <p className="mt-3 text-white/70">{result.reason}</p>
    </div>
  );
}