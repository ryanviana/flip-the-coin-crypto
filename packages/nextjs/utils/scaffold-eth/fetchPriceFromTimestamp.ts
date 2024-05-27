// utils/scaffold-eth.js

export const fetchEthUsdPrices = async () => {
  const response = await fetch("https://min-api.cryptocompare.com/data/v2/histominute?fsym=ETH&tsym=USD&limit=2");
  const data = await response.json();
  const prices = data.Data.Data;

  return {
    currentPrice: prices[1].close,
    pastPrice: prices[0].close,
  };
};
