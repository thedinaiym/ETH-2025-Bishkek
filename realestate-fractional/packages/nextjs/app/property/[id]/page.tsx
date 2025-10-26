"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "~~/utils/propertyData";
import { FractionPurchase } from "~~/components/FractionPurchase";
import { parseEther } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface Property {
  url: string;
  title: string;
  price: number;
  currency: string;
  ad_id: string;
  rooms: string;
  area_m2: number;
  floor: number;
  floors_total: number;
  district: string | null;
  series: string;
  views: number;
  favorites: number;
  description: string;
  features: string | null;
  documents: string | null;
  repair: string | null;
  heating: string | null;
  seller_name: string;
  offer_type: string;
}

export default function PropertyDetail() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: contractProperty, isLoading: contractLoading } = useScaffoldReadContract({
    contractName: "RealEstateFractional",
    functionName: "properties",
    args: params.id ? [BigInt(params.id as string)] : undefined,
  });

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(`/api/properties/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [params.id]);

  if (loading || contractLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>Property not found</span>
        </div>
        <Link href="/marketplace" className="btn btn-primary mt-4">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const hasContractData = contractProperty && contractProperty[0] !== undefined;
  const isActive = hasContractData ? contractProperty[9] : false;
  const totalShares = hasContractData ? Number(contractProperty[4]) : 100;
  const sharePrice = hasContractData ? BigInt(contractProperty[5]) : parseEther("0.01");
  const sharesSold = hasContractData ? Number(contractProperty[6]) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/marketplace" className="btn btn-ghost mb-4">
        ← Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-2xl">{property.title}</h1>

              <div className="divider"></div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Total Price</div>
                  <div className="stat-value text-lg">{formatPrice(property.price, property.currency)}</div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Area</div>
                  <div className="stat-value text-lg">{property.area_m2} m²</div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Rooms</div>
                  <div className="stat-value text-lg">{property.rooms}</div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Floor</div>
                  <div className="stat-value text-lg">
                    {property.floor}/{property.floors_total}
                  </div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                  <div className="stat-title">Series</div>
                  <div className="stat-value text-lg">{property.series}</div>
                </div>
                {property.heating && (
                  <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="stat-title">Heating</div>
                    <div className="stat-value text-sm">{property.heating}</div>
                  </div>
                )}
              </div>

              <div className="divider"></div>

              <div>
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p className="whitespace-pre-wrap">{property.description}</p>
              </div>

              {property.features && (
                <>
                  <div className="divider"></div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Features</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.features.split(";").map((feature, idx) => (
                        <div key={idx} className="badge badge-outline">
                          {feature.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {property.documents && (
                <>
                  <div className="divider"></div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Documents</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.documents.split(";").map((doc, idx) => (
                        <div key={idx} className="badge badge-success">
                          ✓ {doc.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="divider"></div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {property.district && (
                  <div>
                    <strong>District:</strong> {property.district}
                  </div>
                )}
                {property.repair && (
                  <div>
                    <strong>Repair:</strong> {property.repair}
                  </div>
                )}
                <div>
                  <strong>Seller:</strong> {property.seller_name}
                </div>
                <div>
                  <strong>Offer Type:</strong> {property.offer_type}
                </div>
                <div>
                  <strong>Views:</strong> {property.views.toLocaleString()}
                </div>
                <div>
                  <strong>Favorites:</strong> {property.favorites.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <FractionPurchase
            propertyId={parseInt(params.id as string)}
            sharePrice={sharePrice}
            totalShares={totalShares}
            sharesSold={sharesSold}
            title={property.title}
            isActive={isActive}
            hasContractData={hasContractData}
          />
        </div>
      </div>
    </div>
  );
}
