import Image from "next/image";

export const PriceCard = ({
  currentPrice,
  pastPrice,
  onReload,
}: {
  currentPrice: number | null;
  pastPrice: number | null;
  onReload: () => void;
}) => {
  const priceChange = currentPrice !== null && pastPrice !== null ? currentPrice - pastPrice : null;
  const priceChangeClass = priceChange !== null && priceChange > 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 flex flex-col items-center">
      <div className="flex items-center justify-center mb-4">
        <Image
          src="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880"
          alt="Ethereum Logo"
          width={50} // Adjust width as needed
          height={50} // Adjust height as needed
        />
      </div>
      <div className="text-center">
        <div className="text-xl font-bold">Current: ${currentPrice?.toFixed(2)}</div>
        <div className="text-xl font-bold mt-2">60s Ago: ${pastPrice?.toFixed(2)}</div>
        {priceChange !== null && (
          <div className={`text-xl font-bold mt-2 ${priceChangeClass}`}>
            {priceChange > 0 ? "▲" : "▼"} ${Math.abs(priceChange).toFixed(2)}
          </div>
        )}
        <button className="btn btn-primary mt-4" onClick={onReload}>
          Reload
        </button>
      </div>
    </div>
  );
};
