"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PropertyFilters as PropertyFiltersType } from "@/types/property";

type PropertyFiltersProps = {
  initialFilters: PropertyFiltersType;
};

const defaultFilters: PropertyFiltersType = {
  name: "",
  address: "",
  minPrice: undefined,
  maxPrice: undefined,
};

export const PropertyFilters = ({ initialFilters }: PropertyFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<PropertyFiltersType>({
    ...defaultFilters,
    ...initialFilters,
  });

  const isDirty = useMemo(() => {
    return Boolean(
      (filters.name ?? "").length ||
        (filters.address ?? "").length ||
        typeof filters.minPrice === "number" ||
        typeof filters.maxPrice === "number",
    );
  }, [filters]);

  const updateQueryString = (nextFilters: PropertyFiltersType) => {
    const params = new URLSearchParams(searchParams.toString());

    const entries: [keyof PropertyFiltersType, string][] = [
      ["name", nextFilters.name ?? ""],
      ["address", nextFilters.address ?? ""],
    ];

    entries.forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    if (typeof nextFilters.minPrice === "number") {
      params.set("minPrice", String(nextFilters.minPrice));
    } else {
      params.delete("minPrice");
    }

    if (typeof nextFilters.maxPrice === "number") {
      params.set("maxPrice", String(nextFilters.maxPrice));
    } else {
      params.delete("maxPrice");
    }

    const next = params.toString();

    startTransition(() => {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQueryString(filters);
  };

  const handleReset = () => {
    const clearedFilters: PropertyFiltersType = { ...defaultFilters };
    setFilters(clearedFilters);
    updateQueryString(clearedFilters);
  };

  const handleNumericChange = (field: "minPrice" | "maxPrice", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === "" ? undefined : Number(value),
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-2 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            type="text"
            value={filters.name ?? ""}
            onChange={(event) => setFilters((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="e.g. Riverside Loft"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-700">Address</span>
          <input
            type="text"
            value={filters.address ?? ""}
            onChange={(event) => setFilters((prev) => ({ ...prev, address: event.target.value }))}
            placeholder="City, street..."
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-700">Min price</span>
          <input
            type="number"
            min={0}
            value={filters.minPrice ?? ""}
            onChange={(event) => handleNumericChange("minPrice", event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium text-slate-700">Max price</span>
          <input
            type="number"
            min={0}
            value={filters.maxPrice ?? ""}
            onChange={(event) => handleNumericChange("maxPrice", event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-500">
          Use filters to narrow down the results. Empty fields are ignored.
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={!isDirty || isPending}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Loading..." : "Apply filters"}
          </button>
        </div>
      </div>
    </form>
  );
};

