"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "~~/utils/propertyData";

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
}

interface ApiResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface MetaResponse {
  totalProperties: number;
  validProperties: number;
  currencies: string[];
  roomsOptions: string[];
}

export default function Marketplace() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [meta, setMeta] = useState<MetaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("all");
  const [selectedRooms, setSelectedRooms] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchMeta() {
      try {
        const response = await fetch("/api/properties/meta");
        const data = await response.json();
        setMeta(data);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    }
    fetchMeta();
  }, []);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(searchTerm && { search: searchTerm }),
          ...(selectedCurrency !== "all" && { currency: selectedCurrency }),
          ...(selectedRooms !== "all" && { rooms: selectedRooms }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
        });

        const response = await fetch(`/api/properties?${params}`);
        const data: ApiResponse = await response.json();

        setProperties(data.properties);
        setTotalPages(data.totalPages);
        setTotalItems(data.total);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [currentPage, searchTerm, selectedCurrency, selectedRooms, minPrice, maxPrice]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">RealEstate Fractional Marketplace</h1>
        <p className="text-lg opacity-80">Invest in real estate with fractional ownership using Web3</p>
        {meta && (
          <div className="stats shadow mt-4">
            <div className="stat">
              <div className="stat-title">Total Properties</div>
              <div className="stat-value text-primary">{meta.totalProperties.toLocaleString()}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Available Now</div>
              <div className="stat-value text-secondary">{totalItems.toLocaleString()}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Current Page</div>
              <div className="stat-value text-accent">
                {currentPage}/{totalPages}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card bg-base-200 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Search</span>
              </label>
              <input
                type="text"
                placeholder="Search properties..."
                className="input input-bordered"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Currency</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedCurrency}
                onChange={e => {
                  setSelectedCurrency(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="all">All Currencies</option>
                {meta?.currencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Rooms</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedRooms}
                onChange={e => {
                  setSelectedRooms(e.target.value);
                  handleFilterChange();
                }}
              >
                <option value="all">All Rooms</option>
                {meta?.roomsOptions.map(rooms => (
                  <option key={rooms} value={rooms}>
                    {rooms}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Price Range</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="input input-bordered w-1/2"
                  value={minPrice}
                  onChange={e => {
                    setMinPrice(e.target.value);
                    handleFilterChange();
                  }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="input input-bordered w-1/2"
                  value={maxPrice}
                  onChange={e => {
                    setMaxPrice(e.target.value);
                    handleFilterChange();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map(property => (
              <Link href={`/property/${property.ad_id}`} key={property.ad_id}>
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer h-full">
                  <div className="card-body">
                    <h2 className="card-title text-sm line-clamp-2">{property.title}</h2>
                    <div className="space-y-1 text-sm">
                      <p className="font-bold text-lg text-primary">{formatPrice(property.price, property.currency)}</p>
                      <p>
                        📐 {property.area_m2} m² | 🚪 {property.rooms}
                      </p>
                      <p>
                        🏢 Floor: {property.floor}/{property.floors_total}
                      </p>
                      {property.district && <p>📍 {property.district}</p>}
                      {property.series && <div className="badge badge-secondary badge-sm">{property.series}</div>}
                    </div>
                    <div className="card-actions justify-between items-center mt-2">
                      <div className="text-xs opacity-70">
                        👁️ {property.views} | ❤️ {property.favorites}
                      </div>
                      <button className="btn btn-primary btn-sm">View Details</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl opacity-70">No properties found matching your criteria</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="join-item btn">
                  Page {currentPage} of {totalPages}
                </button>
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
