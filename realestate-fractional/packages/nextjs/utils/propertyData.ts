export interface Property {
  url: string;
  title: string;
  price: number;
  currency: string;
  city: string | null;
  created: string;
  updated: string;
  ad_id: string;
  shows: number;
  views: number;
  favorites: number;
  seller_name: string;
  seller_is_pro: boolean;
  phone_mask: string;
  rooms: string;
  area_m2: number;
  floor: number;
  floors_total: number;
  district: string | null;
  series: string;
  documents: string | null;
  heating: string | null;
  repair: string | null;
  features: string | null;
  offer_type: string;
  deal_type: string | null;
  description: string;
  images: string | null;
}

export interface PropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: string;
  district?: string;
  currency?: string;
}

export async function loadProperties(): Promise<Property[]> {
  try {
    const response = await fetch("/data/properties.json");
    if (!response.ok) {
      throw new Error("Failed to load properties");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading properties:", error);
    return [];
  }
}

export function filterProperties(properties: Property[], filters: PropertyFilter): Property[] {
  return properties.filter(property => {
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    if (filters.minArea && property.area_m2 < filters.minArea) return false;
    if (filters.maxArea && property.area_m2 > filters.maxArea) return false;
    if (filters.rooms && property.rooms !== filters.rooms) return false;
    if (filters.district && property.district !== filters.district) return false;
    if (filters.currency && property.currency !== filters.currency) return false;
    return true;
  });
}

export function getPropertyById(properties: Property[], adId: string): Property | undefined {
  return properties.find(p => p.ad_id === adId);
}

export function convertPriceToWei(price: number, currency: string): bigint {
  const priceInETH = convertPriceToETH(price, currency);
  const weiPerEth = BigInt(10) ** BigInt(18);
  return BigInt(Math.floor(priceInETH * Number(weiPerEth)));
}

export function convertPriceToETH(price: number, currency: string): number {
  let priceInUSD = price;
  if (currency === "KGS") {
    priceInUSD = price / 85; // Approximate KGS to USD
  }
  // Convert USD to ETH (assuming 1 ETH = $2500)
  return priceInUSD / 2500;
}

export function formatPrice(price: number, currency: string): string {
  const ethPrice = convertPriceToETH(price, currency);
  return `${ethPrice.toFixed(4)} ETH`;
}

export function formatPriceWithFiat(price: number, currency: string): string {
  const ethPrice = convertPriceToETH(price, currency);
  const fiatPrice = currency === "USD" ? `$${price.toLocaleString()}` : `${price.toLocaleString()} ${currency}`;
  return `${ethPrice.toFixed(4)} ETH (${fiatPrice})`;
}

export function getUniqueValues(properties: Property[], key: keyof Property): string[] {
  const values = properties
    .map(p => p[key])
    .filter((v): v is string => v !== null && v !== undefined && v !== "");
  return Array.from(new Set(values)).sort();
}

export function extractRoomNumber(rooms: string): number {
  const match = rooms.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}
