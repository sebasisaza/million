import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProperty } from "@/lib/api";

type PropertyDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10 lg:flex-row">
      <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-slate-100 lg:h-[480px] lg:flex-1">
        <Image
          src={property.imageUrl}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Property
          </span>
          <h1 className="text-2xl font-semibold text-slate-900">{property.name}</h1>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p>
            <strong className="font-semibold text-slate-900">Address:</strong>{" "}
            {property.address}
          </p>
          <p>
            <strong className="font-semibold text-slate-900">Owner:</strong>{" "}
            {property.idOwner}
          </p>
        </div>
        <div className="text-3xl font-semibold text-slate-900">{formattedPrice}</div>
        <p className="text-sm text-slate-600">
          This property listing is part of the technical assessment. Replace the sample data by
          writing to the API or connecting it to your data source.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Back to listings
          </Link>
          <a
            href="mailto:realestate@example.com"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Contact agent
          </a>
        </div>
      </div>
    </div>
  );
}

