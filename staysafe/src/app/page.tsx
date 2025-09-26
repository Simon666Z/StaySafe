"use client";

import { useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import { URLCard } from "@/components/URLCard";
import { AnalysisResult } from "@/lib/types";

const mockResult: AnalysisResult = {
  status: "uncertain",
  reason: "The product complies with all local regulations.",
  product: {
    name: "My Product",
  },
  sourceLink: "https://www.example.com/regulation",
};

export default function Home() {
  // --- STATE MANAGEMENT ---
  // State to hold the URL from the input field
  const [url, setUrl] = useState<string>("");
  // State to manage the loading status during the API call
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to store any error messages for the user
  const [error, setError] = useState<string | null>(null);
  // State to store the final result from the AI check
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. --- Basic validation ---
    if (!url) {
      setError("Please enter a product URL to check.");
      return;
    }
    // A simple regex to check if the input looks like a URL.
    if (!/^(https?:\/\/)/.test(url)) {
      setError("Please enter a valid URL (e.g., https://...).");
      return;
    }

    // 2. --- Reset State & Start Loading ---
    setError(null);
    setResult(null);
    setIsLoading(true);

    // 3. --- REAL API CALL TO BACKEND ---
    (async () => {
      try {
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          setError(payload?.error || `Request failed: ${res.status}`);
          setIsLoading(false);
          return;
        }

        const data: AnalysisResult = await res.json();
        setResult(data);
      } catch (fetchErr: unknown) {
        const message =
          typeof fetchErr === "string"
            ? fetchErr
            : fetchErr instanceof Error
            ? fetchErr.message
            : "An unknown error occurred";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    })();
  }

  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-6 sm:p-12 bg-gray-900">
      <div className="w-full max-w-3xl bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8">
        <main className="flex flex-col gap-8">
          {/* Show error if validation fails */}
          {error && (
            <div className="text-red-400 bg-red-900/20 border border-red-800 rounded-md p-3">
              {error}
            </div>
          )}

          {/* Show result when available */}
          {result ? (
            <ResultCard result={result} />
          ) : (
            // If no result yet, optionally show a small placeholder or nothing
            <div />
          )}

          <URLCard
            url={url}
            setUrl={setUrl}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </div>
  );
}
