import Image from "next/image";
import Link from "next/link";

import { Property } from "@/types/property";

type PropertyCardProps = {
  property: Property;
};

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={property.imageUrl}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{property.name}</h3>
          <p className="text-sm text-slate-500">{property.address}</p>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-base font-semibold text-slate-900">{formattedPrice}</span>
          <Link
            href={`/properties/${property.id}`}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
};

