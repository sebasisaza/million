export type Property = {
  id: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  imageUrl: string;
};

export type PropertyFilters = {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
};

