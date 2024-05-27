const ethers = await import("npm:ethers@6.10.0");

const fromTimestamp = args[0];
const toTimestamp = args[1];

const URL_PREVIOUS = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=` + fromTimestamp;

const URL_CURRENT = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=` + toTimestamp;

const apiResponsePrevious = await Functions.makeHttpRequest({
  url: URL_PREVIOUS,
});
const apiResponseCurrent = await Functions.makeHttpRequest({
  url: URL_CURRENT,
});

const dataPrevious = apiResponsePrevious.data;
const dataCurrent = apiResponseCurrent.data;

const previousEthPrice = Math.round(dataPrevious.ETH.USD * 10 ** 4);
const currentEthPrice = Math.round(dataCurrent.ETH.USD * 10 ** 4);

const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
  ["bool", "uint256", "uint256"],
  [currentEthPrice > previousEthPrice, fromTimestamp, toTimestamp],
);

return ethers.getBytes(encoded);
