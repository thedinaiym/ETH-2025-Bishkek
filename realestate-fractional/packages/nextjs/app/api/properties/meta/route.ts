import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

let metaCache: any | null = null;

function getMetadata() {
  if (metaCache) {
    return metaCache;
  }

  const filePath = path.join(process.cwd(), "public", "data", "properties.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const properties = JSON.parse(fileContents);

  const validProperties = properties.filter((p: any) => p.price > 0 && p.area_m2 > 0);

  const currencies = Array.from(new Set(validProperties.map((p: any) => p.currency).filter(Boolean))).sort();
  const roomsOptions = Array.from(new Set(validProperties.map((p: any) => p.rooms).filter(Boolean)))
    .sort()
    .slice(0, 15);

  metaCache = {
    totalProperties: properties.length,
    validProperties: validProperties.length,
    currencies,
    roomsOptions,
  };

  return metaCache;
}

export async function GET() {
  try {
    const metadata = getMetadata();
    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error getting metadata:", error);
    return NextResponse.json({ error: "Failed to get metadata" }, { status: 500 });
  }
}
