import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

let propertiesCache: any[] | null = null;

function loadProperties() {
  if (propertiesCache) {
    return propertiesCache;
  }

  const filePath = path.join(process.cwd(), "public", "data", "properties.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  propertiesCache = JSON.parse(fileContents);
  return propertiesCache;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const currency = searchParams.get("currency") || "";
    const rooms = searchParams.get("rooms") || "";
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : null;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : null;

    const properties = loadProperties();
    if (!properties) {
      return NextResponse.json({ error: "Properties not loaded" }, { status: 500 });
    }

    // Filter properties
    let filtered = properties.filter((p: any) => p.price > 0 && p.area_m2 > 0);

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p: any) =>
          p.title?.toLowerCase().includes(searchLower) ||
          p.district?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower),
      );
    }

    if (currency) {
      filtered = filtered.filter((p: any) => p.currency === currency);
    }

    if (rooms) {
      filtered = filtered.filter((p: any) => p.rooms === rooms);
    }

    if (minPrice !== null) {
      filtered = filtered.filter((p: any) => p.price >= minPrice);
    }

    if (maxPrice !== null) {
      filtered = filtered.filter((p: any) => p.price <= maxPrice);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filtered.slice(startIndex, endIndex);

    return NextResponse.json({
      properties: paginatedProperties,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  } catch (error) {
    console.error("Error loading properties:", error);
    return NextResponse.json({ error: "Failed to load properties" }, { status: 500 });
  }
}
