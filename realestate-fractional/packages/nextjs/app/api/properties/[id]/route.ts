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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const properties = loadProperties();
    const property = properties.find((p: any) => p.ad_id === params.id);

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error loading property:", error);
    return NextResponse.json({ error: "Failed to load property" }, { status: 500 });
  }
}
