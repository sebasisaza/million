import { Property } from "@/types/property";

import { PropertyCard } from "./PropertyCard";

type PropertyGridProps = {
  properties: Property[];
};

export const PropertyGrid = ({ properties }: PropertyGridProps) => {
  if (properties.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
        No properties matched your criteria. Adjust your filters or try again later.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

