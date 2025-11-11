import "server-only";

import { Property, PropertyFilters } from "@/types/property";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const buildQueryString = (filters: PropertyFilters & { page?: number; pageSize?: number }) => {
  const params = new URLSearchParams();

  if (filters.name) params.set("name", filters.name);
  if (filters.address) params.set("address", filters.address);
  if (typeof filters.minPrice === "number") params.set("minPrice", String(filters.minPrice));
  if (typeof filters.maxPrice === "number") params.set("maxPrice", String(filters.maxPrice));
  if (typeof filters.page === "number") params.set("page", String(filters.page));
  if (typeof filters.pageSize === "number") params.set("pageSize", String(filters.pageSize));

  return params.toString();
};

export const getProperties = async (filters: PropertyFilters) => {
  const queryString = buildQueryString(filters);
  const response = await fetch(
    `${API_BASE_URL}/api/properties${queryString ? `?${queryString}` : ""}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.statusText}`);
  }

  const data = (await response.json()) as Property[];
  return data;
};

export const getProperty = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch property: ${response.statusText}`);
  }

  const data = (await response.json()) as Property;
  return data;
};

