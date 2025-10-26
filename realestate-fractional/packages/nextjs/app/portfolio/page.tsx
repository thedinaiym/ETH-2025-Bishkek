"use client";

import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { formatEther } from "viem";
import Link from "next/link";

export default function Portfolio() {
  const { address, isConnected } = useAccount();

  const { data: totalProperties } = useScaffoldReadContract({
    contractName: "RealEstateFractional",
    functionName: "getTotalProperties",
  });

  const { data: userProperties } = useScaffoldReadContract({
    contractName: "RealEstateFractional",
    functionName: "getUserOwnedProperties",
    args: address ? [address] : undefined,
  });

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
          <div className="card-body text-center">
            <h1 className="card-title text-3xl justify-center mb-4">Портфолио инвестора</h1>
            <p className="mb-6">Подключите кошелек для просмотра ваших инвестиций</p>
            <div className="flex justify-center">
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const propertyIds = (userProperties as bigint[]) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Мой Портфолио</h1>
        <Link href="/marketplace" className="btn btn-primary">
          Купить фракции
        </Link>
      </div>

      <div className="stats shadow w-full mb-6">
        <div className="stat">
          <div className="stat-title">Подключенный кошелек</div>
          <div className="stat-value text-lg break-all">{address}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Всего объектов в системе</div>
          <div className="stat-value">{totalProperties?.toString() || "0"}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Ваши инвестиции</div>
          <div className="stat-value">{propertyIds.length}</div>
        </div>
      </div>

      {propertyIds.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">У вас пока нет инвестиций</h2>
            <p>Купите фракции недвижимости на маркетплейсе</p>
            <Link href="/marketplace" className="btn btn-primary mx-auto mt-4">
              Перейти на маркетплейс
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertyIds.map(propertyId => (
            <PropertyCard key={propertyId.toString()} propertyId={propertyId} userAddress={address!} />
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ propertyId, userAddress }: { propertyId: bigint; userAddress: string }) {
  const { data: balance } = useScaffoldReadContract({
    contractName: "RealEstateFractional",
    functionName: "balanceOf",
    args: [userAddress as `0x${string}`, propertyId],
  });

  const { data: property } = useScaffoldReadContract({
    contractName: "RealEstateFractional",
    functionName: "properties",
    args: [propertyId],
  });

  if (!balance || balance === 0n || !property) {
    return null;
  }

  const [, title, location, , totalShares, sharePrice, sharesSold, , , isActive] = property as any[];

  const ownershipPercent = (Number(balance) / Number(totalShares)) * 100;
  const investmentValue = BigInt(sharePrice) * BigInt(balance);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-lg">{title}</h2>
        <p className="text-sm opacity-70">{location}</p>

        <div className="divider my-2"></div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Ваши фракции:</span>
            <span className="font-bold">{balance.toString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Всего фракций:</span>
            <span>{totalShares.toString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Владение:</span>
            <span className="font-bold text-primary">{ownershipPercent.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Стоимость:</span>
            <span className="font-bold">{formatEther(investmentValue)} ETH</span>
          </div>
          <div className="flex justify-between">
            <span>Цена за фракцию:</span>
            <span>{formatEther(sharePrice)} ETH</span>
          </div>
        </div>

        <div className="divider my-2"></div>

        <div className="stats bg-base-200 shadow">
          <div className="stat p-2">
            <div className="stat-title text-xs">Продано</div>
            <div className="stat-value text-sm">
              {sharesSold.toString()}/{totalShares.toString()}
            </div>
            <div className="stat-desc text-xs">
              {((Number(sharesSold) / Number(totalShares)) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <Link href={`/property/${propertyId.toString()}`} className="btn btn-sm btn-primary">
            Подробнее
          </Link>
        </div>

        {!isActive && <div className="badge badge-warning badge-sm">Неактивен</div>}
      </div>
    </div>
  );
}
