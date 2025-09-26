import { AnalysisResult } from "@/library/types";
import { Trash2 } from "lucide-react"; // Using a simple icon for the clear button

/**
 * --- PROPS DEFINITION ---
 * Defines the data and functions this component needs from its parent.
 */
interface HistoryListProps {
  // An array of past analysis results
  history: AnalysisResult[];
  // A function to call when a history item is clicked
  onItemClick: (result: AnalysisResult) => void;
  // A function to call when the "Clear History" button is clicked
  onClear: () => void;
}

/**
 * --- HistoryList Component ---
 * Renders a scrollable list of past search results.
 */
export function HistoryList({
  history,
  onItemClick,
  onClear,
}: HistoryListProps) {
  // If there's no history, don't render anything.
  if (history.length === 0) {
    return null;
  }

  const statusColors: { [key in AnalysisResult["status"]]: string } = {
    legal: "text-green-400",
    prohibited: "text-red-400",
    uncertain: "text-yellow-400",
  };

  return (
     <div> {/* Simplified wrapper */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-white">History</h2>
        <button
          onClick={onClear}
          title="Clear History"
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>
      <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {history.map((item, index) => (
          <li key={`${item.sourceUrl}-${index}`}>
            <button
              type="button"
              onClick={() => onItemClick(item)}
              className="w-full text-left p-3 bg-gray-900/60 hover:bg-gray-700/80 rounded-lg 
                         transition-all duration-200 
                         border border-gray-700/50 hover:border-emerald-700 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <p className="font-semibold text-white truncate">{item.product.name}</p>
              <p className="text-xs text-gray-400 truncate mt-1">{item.sourceUrl}</p>
            </button>
          </li>
        ))}
      </ul>
      {/* A simple custom scrollbar for better aesthetics in a dark theme */}
      <style>
        {` .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4A5568; /* gray-600 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #2D3748; /* gray-700 */
        }`}
      </style>
    </div>
  );
}
