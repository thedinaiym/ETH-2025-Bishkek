"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5 max-w-4xl mx-auto">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RealEstate Fractional
            </span>
          </h1>

          <div className="card bg-base-200 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title text-2xl justify-center">Invest in Real Estate with Web3</h2>
              <p className="text-center text-lg">
                Tokenize and own fractions of real estate properties using blockchain technology. Built on{" "}
                <strong>Status Network Sepolia</strong> testnet.
              </p>
            </div>
          </div>

          {connectedAddress && (
            <div className="flex justify-center items-center space-x-2 flex-col mb-8">
              <p className="my-2 font-medium">Your Wallet Address:</p>
              <Address address={connectedAddress} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Network</div>
                <div className="stat-value text-primary text-lg">Status Sepolia</div>
                <div className="stat-desc">Testnet (Chain ID: 1660990954)</div>
              </div>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Properties</div>
                <div className="stat-value text-secondary text-lg">93,602+</div>
                <div className="stat-desc">From Lalafo.kg</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/marketplace">
                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center rounded-3xl hover:shadow-2xl transition-all cursor-pointer h-full">
                  <div className="text-4xl mb-4">🏘️</div>
                  <h3 className="text-xl font-bold mb-2">Browse Marketplace</h3>
                  <p>Explore 93,000+ real estate properties available for fractional investment</p>
                </div>
              </Link>

              <Link href="/debug">
                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center rounded-3xl hover:shadow-2xl transition-all cursor-pointer h-full">
                  <div className="text-4xl mb-4">🔧</div>
                  <h3 className="text-xl font-bold mb-2">Debug Contracts</h3>
                  <p>Interact with RealEstateFractional smart contract and test functions</p>
                </div>
              </Link>

              <Link href="/blockexplorer">
                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center rounded-3xl hover:shadow-2xl transition-all cursor-pointer h-full">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-2">Block Explorer</h3>
                  <p>View transactions and explore Status Sepolia blockchain activity</p>
                </div>
              </Link>
            </div>

            <div className="mt-12 text-center">
              <div className="alert alert-info inline-block max-w-2xl">
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
                  <h3 className="font-bold">How It Works</h3>
                  <div className="text-sm">
                    Connect your Web3 wallet → Browse properties → Purchase fractional shares (ERC-1155 tokens) →
                    Manage your real estate portfolio
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
