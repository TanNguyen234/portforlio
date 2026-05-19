import { portfolio } from "@/lib/portfolio";
import type { PortfolioData } from "@/lib/portfolio";

const STORAGE_KEY = "portfolioData_v2";

export const defaultPortfolio = portfolio;

export const clonePortfolio = (): PortfolioData =>
  JSON.parse(JSON.stringify(defaultPortfolio)) as PortfolioData;

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const mergeDeep = <T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>
): T => {
  const result = { ...base } as T;
  const writableResult = result as Record<string, unknown>;

  Object.keys(override).forEach((key) => {
    const baseValue = writableResult[key];
    const overrideValue = override[key];

    if (Array.isArray(overrideValue)) {
      writableResult[key] = overrideValue;
      return;
    }

    if (isObject(baseValue) && isObject(overrideValue)) {
      writableResult[key] = mergeDeep(
        baseValue as Record<string, unknown>,
        overrideValue
      );
      return;
    }

    writableResult[key] = overrideValue;
  });

  return result;
};

export const loadPortfolio = (): PortfolioData => {
  if (typeof window === "undefined") {
    return clonePortfolio();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return clonePortfolio();

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return mergeDeep(clonePortfolio() as Record<string, unknown>, parsed) as PortfolioData;
  } catch {
    return clonePortfolio();
  }
};

export const savePortfolio = (data: PortfolioData) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const resetPortfolio = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};
