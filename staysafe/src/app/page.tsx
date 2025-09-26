"use client";

import { useState } from "react";
import { ResultCard } from "@/components/ResultCard";
import { URLCard } from "@/components/URLCard";
import { AnalysisResult } from "@/library/types";

const mockResult: AnalysisResult = {
  status: "uncertain",
  reason: "The product complies with all local regulations.",
  product: {
    name: "My Product",
  },
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

  // Accepts full http(s) URLs or domain-like inputs (example.com),
  // but rejects single-word hosts like "fda". Also allows localhost and IPs.
  function isValidUrl(input: string): boolean {
    if (!input) return false;
    // Try as-is first (handles proper http(s) URLs)
    try {
      const parsed = new URL(input);
      const host = parsed.hostname || "";
      return (
        host === "localhost" || host.includes(".") || /^[0-9:.]+$/.test(host) // IPv4/IPv6-ish
      );
    } catch {
      // If missing scheme, try prepending https:// and re-parse
      try {
        const parsed = new URL("https://" + input);
        const host = parsed.hostname || "";
        return (
          host === "localhost" || host.includes(".") || /^[0-9:.]+$/.test(host)
        );
      } catch {
        return false;
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. --- Basic validation ---
    if (!url || !isValidUrl(url)) {
      setError("Please enter a valid URL to check.");
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

          <URLCard
            url={url}
            setUrl={setUrl}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
          {/* Visible debug output so you can see the value update without opening DevTools */}

          {/* Show result when available */}
          {result ? (
            <ResultCard result={result} />
          ) : (
            // If no result yet, optionally show a small placeholder or nothing
            <div />
          )}
        </main>
      </div>
    </div>
  );
}
