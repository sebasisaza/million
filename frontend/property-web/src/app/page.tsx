import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import { getProperties } from "@/lib/api";
import type { Property, PropertyFilters as PropertyFiltersType } from "@/types/property";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const parseFilters = (params: Record<string, string | string[] | undefined>): PropertyFiltersType => {
  const parseNumber = (value?: string | string[]) => {
    if (!value) return undefined;
    const parsed = Array.isArray(value) ? Number(value[0]) : Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const getFirstValue = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] ?? "" : value ?? "";

  return {
    name: getFirstValue(params.name),
    address: getFirstValue(params.address),
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFilters(resolvedSearchParams);

  let properties: Property[] = [];
  let errorMessage: string | null = null;

  try {
    properties = await getProperties(filters);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred while fetching data.";
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 bg-slate-50 px-4 py-10 lg:px-12">
      <header className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Property catalog
        </span>
        <h1 className="text-3xl font-semibold text-slate-900">Explore our latest listings</h1>
        <p className="max-w-3xl text-sm text-slate-600">
          Browse residential properties, filter by price range, and explore detailed descriptions.
          Data is sourced from a MongoDB database via the .NET backend API.
        </p>
      </header>

      <PropertyFilters initialFilters={filters} />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : (
        <PropertyGrid properties={properties} />
      )}
    </main>
  );
}
