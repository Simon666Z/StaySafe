import clsx from "clsx";
import { AnalysisResult } from "@/lib/types";

interface ResultCardProps {
  result: AnalysisResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const cardClasses = clsx("p-4 rounded-lg border text-left w-full", {
    "bg-green-50 border-green-300 text-green-800": result.status === "legal",
    "bg-red-50 border-red-300 text-red-800": result.status === "prohibited",
    "bg-yellow-50 border-yellow-300 text-yellow-800":
      result.status === "uncertain",
  });

  const statusIcons = {
    legal: "✅",
    prohibited: "❌",
    uncertain: "❓",
  };

  return (
    <div className={cardClasses}>
      {/* The layout is now a single, simple column */}
      <div>
        {/* Product Name */}
        <p className="font-bold text-base opacity-90">{result.product.name}</p>

        {/* Status */}
        <p className="text-xl font-bold mt-2">
          <span className="mr-2">{statusIcons[result.status]}</span>
          {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
        </p>

        {/* Reason */}
        <p className="mt-2 text-sm">{result.reason}</p>

        {/* Source Link */}
        <a
          href={result.sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm font-semibold mt-3 inline-block hover:underline"
        >
          View Official Regulation →
        </a>
      </div>
    </div>
  );
}
