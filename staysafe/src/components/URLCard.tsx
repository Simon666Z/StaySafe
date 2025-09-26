"use client";

import React from "react";
import { ScanLine, Link, Loader2 } from "lucide-react";

/**
 * --- PROPS DEFINITION ---
 * Defines the data and functions this component needs from its parent.
 */
interface URLInputFormProps {
  url: string;
  setUrl: (value: string) => void;
  isLoading: boolean;
  onSubmit: (event: React.FormEvent) => void;
}

/**
 * --- URL Input Component ---
 * A self-contained form for submitting a product URL.
 */
export const URLCard: React.FC<URLInputFormProps> = ({
  url,
  setUrl,
  isLoading,
  onSubmit,
}) => {
  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          Swiss Compliance Checker
        </h1>
        <p className="text-gray-400 mt-2">
          Enter a product URL to check its import legality.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="product-url" className="sr-only">
            Product URL
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Link className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="product-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              placeholder="e.g., https://www.e-commerce.com/product/..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow duration-300"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 font-bold py-3 px-4 rounded-lg hover:bg-emerald-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <ScanLine className="h-5 w-5" />
              Check Legality
            </>
          )}
        </button>
      </form>
    </div>
  );
};
