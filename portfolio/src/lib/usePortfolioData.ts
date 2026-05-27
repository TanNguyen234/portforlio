"use client";

import { useEffect, useState } from "react";
import type { PortfolioData } from "@/lib/portfolio";
import { clonePortfolio } from "@/lib/portfolioStore";

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData>(clonePortfolio());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) {
          throw new Error("Failed to fetch portfolio data");
        }
        const json = await res.json();
        if (active) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading portfolio from DB:", err);
        if (active) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const updatePortfolio = async (next: PortfolioData) => {
    setData(next);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(next),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to save portfolio data");
      }
      return { success: true };
    } catch (err) {
      console.error("Error updating portfolio in DB:", err);
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  };

  const resetToDefault = async () => {
    const defaultData = clonePortfolio();
    const result = await updatePortfolio(defaultData);
    if (result.success) {
      setData(defaultData);
    }
    return result;
  };

  return { data, updatePortfolio, resetToDefault, loading, error };
};

