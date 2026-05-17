"use client";

import { useEffect, useState } from "react";
import type { PortfolioData } from "@/lib/portfolio";
import {
  clonePortfolio,
  loadPortfolio,
  resetPortfolio,
  savePortfolio,
} from "@/lib/portfolioStore";

export const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData>(clonePortfolio());

  useEffect(() => {
    setData(loadPortfolio());
  }, []);

  const updatePortfolio = (next: PortfolioData) => {
    setData(next);
    savePortfolio(next);
  };

  const resetToDefault = () => {
    resetPortfolio();
    setData(clonePortfolio());
  };

  return { data, updatePortfolio, resetToDefault };
};
