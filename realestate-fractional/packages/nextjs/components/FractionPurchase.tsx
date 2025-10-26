"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { formatEther, parseEther } from "viem";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

interface FractionPurchaseProps {
  propertyId: number;
  sharePrice: bigint;
  totalShares: number;
  sharesSold: number;
  title: string;
  isActive?: boolean;
  hasContractData?: boolean;
}

export const FractionPurchase = ({
  propertyId,
  sharePrice,
  totalShares,
  sharesSold,
  title,
  isActive = false,
  hasContractData = false,
}: FractionPurchaseProps) => {
  const { address, isConnected } = useAccount();
  const [quantity, setQuantity] = useState(1);
  const { writeContractAsync, isPending } = useScaffoldWriteContract("RealEstateFractional");

  const availableShares = totalShares - sharesSold;
  const totalCost = sharePrice * BigInt(quantity);
  const canPurchase = hasContractData && isActive && availableShares > 0;

  const handlePurchase = async () => {
    if (!isConnected) {
      alert("Пожалуйста, подключите кошелек");
      return;
    }

    if (quantity <= 0 || quantity > availableShares) {
      alert(`Выберите количество от 1 до ${availableShares}`);
      return;
    }

    try {
      await writeContractAsync({
        functionName: "purchaseShares",
        args: [BigInt(propertyId), BigInt(quantity)],
        value: totalCost,
      });
      alert("Фракции успешно куплены!");
      setQuantity(1);
    } catch (error) {
      console.error("Ошибка покупки:", error);
      alert("Ошибка при покупке фракций. Проверьте баланс и попробуйте снова.");
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Купить фракции</h3>
        
        {!isConnected ? (
          <div className="text-center py-4">
            <p className="mb-4">Подключите кошелек для покупки фракций</p>
            <RainbowKitCustomConnectButton />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Количество фракций</span>
                  <span className="label-text-alt">
                    Доступно: {availableShares} из {totalShares}
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={availableShares}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input input-bordered w-full"
                  disabled={isPending || availableShares === 0}
                />
              </div>

              <div className="stats shadow w-full">
                <div className="stat">
                  <div className="stat-title">Цена за фракцию</div>
                  <div className="stat-value text-2xl">{formatEther(sharePrice)} ETH</div>
                </div>
              </div>

              <div className="stats shadow w-full">
                <div className="stat">
                  <div className="stat-title">Итого к оплате</div>
                  <div className="stat-value text-primary">{formatEther(totalCost)} ETH</div>
                  <div className="stat-desc">{quantity} фракц. × {formatEther(sharePrice)} ETH</div>
                </div>
              </div>

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
                <span>
                  Вы получите {quantity} {quantity === 1 ? "фракцию" : "фракций"} объекта &quot;{title}&quot; в виде
                  ERC-1155 токенов
                </span>
              </div>

              {!hasContractData && (
                <div className="alert alert-warning">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Этот объект еще не токенизирован в смарт-контракте</span>
                </div>
              )}

              {hasContractData && !isActive && (
                <div className="alert alert-error">
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
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Этот объект неактивен и недоступен для покупки</span>
                </div>
              )}

              <button
                className="btn btn-primary w-full"
                onClick={handlePurchase}
                disabled={isPending || !canPurchase}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Обработка транзакции...
                  </>
                ) : !hasContractData ? (
                  "Не токенизирован"
                ) : !isActive ? (
                  "Объект неактивен"
                ) : availableShares === 0 ? (
                  "Все фракции проданы"
                ) : (
                  `Купить за ${formatEther(totalCost)} ETH`
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
