"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { parseEther } from "viem";
import { mainnet } from "viem/chains";
import { PriceCard } from "~~/components/learn-chainlink/PriceCard";
import { EtherInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { fetchEthUsdPrices } from "~~/utils/scaffold-eth";

const FlipTheCoin: NextPage = () => {
  const coinImage = "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880";

  const [ethAmount, setEthAmount] = useState("");
  const [prediction, setPrediction] = useState(true);
  const [flipping, setFlipping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [result, setResult] = useState<string | null>(null);
  const [imageRotation, setImageRotation] = useState("0deg");
  const [betIndex, setBetIndex] = useState<number | null>(null);
  const [betTimestamp, setBetTimestamp] = useState<number | null>(null);
  const [oracleResponseReady, setOracleResponseReady] = useState(false);
  const [oracleResponseResult, setOracleResponseResult] = useState<boolean | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [pastPrice, setPastPrice] = useState<number | null>(null);

  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("FlipTheCoin");

  const { data: numberOfBets } = useScaffoldReadContract({
    contractName: "FlipTheCoin",
    functionName: "getNumberOfBets",
    args: ["0xF3b64dD5AF39d8fF0c614F7637e339e31466c4C3"],
    watch: true,
  });

  const { data: oracleData } = useScaffoldReadContract({
    contractName: "ETHOracle",
    functionName: "didPriceIncrease",
    args: betTimestamp !== null ? [BigInt(betTimestamp), BigInt(betTimestamp) + BigInt(60)] : [undefined, undefined],
    watch: true,
  });

  useEffect(() => {
    if (oracleData && oracleData[1]) {
      setOracleResponseResult(oracleData[0]);
      setOracleResponseReady(oracleData[1]);
    }
  }, [oracleData]);

  useEffect(() => {
    if (numberOfBets !== undefined) {
      setBetIndex(numberOfBets > 0 ? Number(BigInt(numberOfBets) - BigInt(1)) : null);
    }
  }, [numberOfBets]);

  useEffect(() => {
    if (flipping) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setShowResults(true);
            setFlipping(false);
            return 60;
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [flipping]);

  useEffect(() => {
    setImageRotation(prediction ? "0deg" : "180deg");
  }, [prediction]);

  const startGuess = async () => {
    if (!flipping) {
      setFlipping(true);
      setShowResults(false);
      setResult(null);
      setCountdown(60);

      const currentEpoch = Math.floor(Date.now() / 1000);
      setBetTimestamp(currentEpoch);

      try {
        await writeYourContractAsync({
          functionName: "placeBet",
          args: [prediction, parseEther(ethAmount), BigInt(currentEpoch)],
          value: parseEther(ethAmount),
        });
      } catch (e) {
        console.error("Erro ao fazer a aposta:", e);
        setFlipping(false);
      }
    }
  };

  const resolveGuess = async () => {
    if (betIndex !== null) {
      try {
        await writeYourContractAsync({
          functionName: "resolveBet",
          args: [BigInt(betIndex)],
        });

        if (oracleResponseResult === prediction) {
          notification.success("Congratulations! You won the bet!");
          setResult("Congratulations! You won the bet! 🎉");
        } else {
          notification.error("Sorry, you lost the bet. Better luck next time!");
          setResult("Sorry, you lost the bet. Better luck next time! 😢");
        }

        setShowResults(false);
      } catch (e) {
        console.error("Erro ao resolver a aposta:", e);
      }
    }
  };

  const fetchPrices = useCallback(async () => {
    const { currentPrice, pastPrice } = await fetchEthUsdPrices();

    setCurrentPrice(currentPrice);
    setPastPrice(pastPrice);
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-750" : "bg-gray-200"}`}
    >
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${
          isDarkMode ? "bg-gray-750" : "bg-gray-200"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-8">
          <div
            className={`flex flex-col max-w-lg mx-auto p-8 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-2xl rounded-2xl`}
          >
            <h1 className={`text-4xl font-bold text-center ${isDarkMode ? "text-white" : "text-gray-900"} mb-10`}>
              Flip The Coin
            </h1>
            <div className="flex flex-col items-center">
              <div className="flex gap-4 mb-4">
                <button
                  className={`btn ${prediction ? "btn-primary" : "btn-outline"} w-32`}
                  onClick={() => setPrediction(true)}
                >
                  Up
                </button>
                <button
                  className={`btn ${!prediction ? "btn-primary" : "btn-outline"} w-32`}
                  onClick={() => setPrediction(false)}
                >
                  Down
                </button>
              </div>
              {!flipping && (
                <div className="mb-4 w-full max-w-xs">
                  <EtherInput value={ethAmount} onChange={amount => setEthAmount(amount)} />
                </div>
              )}
              <div className="relative mt-4">
                <Image
                  src={coinImage}
                  alt="Flip Coin"
                  className={`cursor-pointer ${flipping ? "opacity-70" : "opacity-100"}`}
                  style={{ transition: "opacity 0.5s ease, transform 0.8s", transform: `rotate(${imageRotation})` }}
                  width={192} // Ajuste a largura conforme necessário
                  height={192} // Ajuste a altura conforme necessário
                />
                {flipping && (
                  <div
                    className={`absolute top-0 left-0 w-full h-full flex items-center justify-center text-xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    } backdrop-blur-md`}
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    {countdown}
                  </div>
                )}
              </div>
              <button className="btn btn-primary mt-4 mb-4" onClick={startGuess}>
                Bet
              </button>
              {showResults && (
                <div className="mt-4">
                  <button
                    className={`btn ${oracleResponseReady ? "btn-success" : "btn-disabled"} w-32`}
                    onClick={resolveGuess}
                    disabled={!oracleResponseReady}
                    title={oracleResponseReady ? "" : "ETH Oracle is finishing running"}
                  >
                    Resolve Bet
                  </button>
                  {result && (
                    <div className={`text-2xl font-bold mt-2 ${result.includes("won") ? "win" : "lose"}`}>{result}</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <PriceCard currentPrice={currentPrice} pastPrice={pastPrice} onReload={fetchPrices} />
        </div>
      </div>
    </div>
  );
};

export default FlipTheCoin;
