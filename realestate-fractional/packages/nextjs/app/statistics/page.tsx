"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { convertPriceToETH } from "~~/utils/propertyData";

interface PropertyStats {
  totalProperties: number;
  avgPrice: number;
  totalValue: number;
  byRooms: { name: string; value: number; avgPrice: number }[];
  byDistrict: { name: string; value: number }[];
  byPriceRange: { name: string; value: number }[];
  priceDistribution: { range: string; count: number }[];
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<PropertyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/properties?limit=1000");
        const data = await response.json();
        const properties = data.properties;

        const roomsMap = new Map<string, { count: number; totalPrice: number }>();
        const districtsMap = new Map<string, number>();
        const priceRanges = [
          { min: 0, max: 0.5, label: "< 0.5 ETH" },
          { min: 0.5, max: 1, label: "0.5-1 ETH" },
          { min: 1, max: 2, label: "1-2 ETH" },
          { min: 2, max: 5, label: "2-5 ETH" },
          { min: 5, max: Infinity, label: "> 5 ETH" },
        ];

        let totalValue = 0;

        properties.forEach((p: any) => {
          const ethPrice = convertPriceToETH(p.price, p.currency);
          totalValue += ethPrice;

          const roomKey = p.rooms || "Unknown";
          if (!roomsMap.has(roomKey)) {
            roomsMap.set(roomKey, { count: 0, totalPrice: 0 });
          }
          const roomData = roomsMap.get(roomKey)!;
          roomData.count++;
          roomData.totalPrice += ethPrice;

          const district = p.district || "Unknown";
          districtsMap.set(district, (districtsMap.get(district) || 0) + 1);
        });

        const byRooms = Array.from(roomsMap.entries())
          .map(([name, data]) => ({
            name,
            value: data.count,
            avgPrice: data.totalPrice / data.count,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8);

        const byDistrict = Array.from(districtsMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);

        const priceDistribution = priceRanges.map(range => {
          const count = properties.filter((p: any) => {
            const ethPrice = convertPriceToETH(p.price, p.currency);
            return ethPrice >= range.min && ethPrice < range.max;
          }).length;
          return { range: range.label, count };
        });

        setStats({
          totalProperties: properties.length,
          avgPrice: totalValue / properties.length,
          totalValue,
          byRooms,
          byDistrict,
          byPriceRange: priceDistribution.map(p => ({ name: p.range, value: p.count })),
          priceDistribution,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>Failed to load statistics</span>
        </div>
      </div>
    );
  }

  const COLORS = ["#10B981", "#059669", "#34D399", "#6EE7B7", "#A7F3D0", "#D1FAE5"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Real Estate Market Statistics</h1>
        <Link href="/marketplace" className="btn btn-primary">
          Browse Properties
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Total Properties</div>
            <div className="stat-value text-primary">{stats.totalProperties.toLocaleString()}</div>
            <div className="stat-desc">Available for fractional ownership</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Average Price</div>
            <div className="stat-value text-success">{stats.avgPrice.toFixed(4)} ETH</div>
            <div className="stat-desc">≈ ${(stats.avgPrice * 2500).toLocaleString()} USD</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Total Market Value</div>
            <div className="stat-value text-accent">{stats.totalValue.toFixed(2)} ETH</div>
            <div className="stat-desc">≈ ${((stats.totalValue * 2500) / 1000000).toFixed(2)}M USD</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Properties by Number of Rooms</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byRooms}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#10B981" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Price Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.priceDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={100} label>
                  {stats.priceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Average Price by Room Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.byRooms}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value.toFixed(4)} ETH`} />
                <Legend />
                <Line type="monotone" dataKey="avgPrice" stroke="#10B981" strokeWidth={2} name="Avg Price (ETH)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Top 10 Districts by Property Count</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byDistrict} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#059669" name="Properties" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl mt-8">
        <div className="card-body">
          <h2 className="card-title">Market Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <h3 className="font-bold">Most Popular</h3>
                <div className="text-xs">
                  {stats.byRooms[0]?.name} apartments with {stats.byRooms[0]?.value} listings
                </div>
              </div>
            </div>

            <div className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Best Value</h3>
                <div className="text-xs">
                  Avg {stats.byRooms[0]?.avgPrice.toFixed(4)} ETH per property
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
