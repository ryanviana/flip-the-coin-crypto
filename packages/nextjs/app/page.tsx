"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import addConsumerImage from "~~/components/assets/add_consumer.png";
import playgroundImage from "~~/components/assets/chainlink_playground.png";
import bannerImage from "~~/components/assets/flip_the_coin.webp";
import gameScreenshot from "~~/components/assets/flip_the_coin_game.png";
import { Checkpoint } from "~~/components/learn-chainlink/Checkpoint";
import { CodeText } from "~~/components/learn-chainlink/CodeText";

const Home: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Flip The Coin Crypto - Chainlink Challenge</title>
      </Head>
      <div className="min-h-screen bg-blue-50 dark:bg-gray-900 text-gray-800 dark:text-gray-300 transition-colors duration-300">
        <div className="container mx-auto p-4">
          <Image
            src={bannerImage}
            alt="Chainlink Challenge Banner"
            layout="responsive"
            className="w-full max-w-2xl mx-auto"
          />
          <h1 className="text-4xl font-bold text-center my-10">Learn Chainlink: Flip The Coin Crypto Challenge</h1>
          <div className="mx-40 space-y-6">
            {/* Introduction */}
            <section id="introduction">
              <h2 className="text-3xl font-semibold">🚀 Introduction</h2>
              <p>
                Welcome to the Flip The Coin Crypto Challenge! In this challenge, you'll build a game that predicts
                whether the price of Ethereum will go up or down in the next minute using Chainlink Functions.
              </p>
            </section>

            {/* Checkpoint 0: Setting Up Your Environment */}
            <Checkpoint title="Checkpoint 0: 📦 Setting Up Your Environment">
              <h2 className="text-xl font-bold mt-4">Initial Setup</h2>
              <p>Start by installing the necessary tools to work on the Chainlink challenge:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Node.js (version &gt;= 18.17): Node.js is a JavaScript runtime used to run server-side code.</li>
                <li>Yarn (version 1 or newer): Yarn is a package manager that helps manage project dependencies.</li>
                <li>Git: Git is a version control system for tracking changes in your code.</li>
              </ul>

              <h2 className="text-xl font-bold mt-4">Repository Setup</h2>
              <p>Clone the challenge repository and prepare your development environment:</p>
              <CodeText>
                {`git clone https://github.com/ryanviana/learn-chainlink.git 
cd learn-chainlink
git checkout flip-the-coin-challenge
yarn install
yarn chain`}
              </CodeText>

              <p>This command sequence does the following:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <code>git clone</code> - clones the repository to your local machine.
                </li>
                <li>
                  <code>cd learn-chainlink</code> - navigates into the project directory.
                </li>
                <li>
                  <code>git checkout flip-the-coin-challenge</code> - switches to the specified challenge branch.
                </li>
                <li>
                  <code>yarn install</code> - installs the project dependencies.
                </li>
                <li>
                  <code>yarn chain</code> - starts a local blockchain instance using Hardhat.
                </li>
              </ul>

              <p>Deploy your contracts locally:</p>
              <CodeText>{`yarn deploy`}</CodeText>

              <p>This command deploys the smart contracts to your local blockchain.</p>

              <p>Start the local development server to run the frontend:</p>
              <CodeText>{`yarn start`}</CodeText>

              <p className="mt-4">
                Open{" "}
                <a href="http://localhost:3000" className="text-blue-700 underline">
                  http://localhost:3000
                </a>{" "}
                in your browser to view the application.
              </p>

              <h2 className="text-xl font-bold mt-4">Chainlink Configuration</h2>
              <p>
                Since we are using Chainlink Functions, all tests will be conducted on the Sepolia test network instead
                of a local blockchain like Hardhat. To fully participate in this challenge, ensure your setup on the
                Sepolia test network:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Request testnet ETH and Link Tokens via the{" "}
                  <a href="https://faucets.chain.link/sepolia" className="text-blue-700 underline">
                    Chainlink faucet service
                  </a>
                  .
                </li>
                <li>
                  Create a Chainlink Functions Subscription following this{" "}
                  <a href="https://functions.chain.link" className="text-blue-700 underline">
                    link
                  </a>
                  .
                </li>
                <li>
                  Update the <code>target network</code> in your ScaffoldETH configuration to point to Sepolia:
                  <p className="mt-4"></p>
                  <CodeText>
                    {`// packages/nextjs/scaffold.config.ts
module.exports = {
  targetNetwork: 'chains.sepolia'
}`}
                  </CodeText>
                </li>
              </ul>

              <p>If you need help:</p>
              <details>
                <summary className="font-semibold cursor-pointer">Detailed Step-by-Step Guide</summary>
                <p>Follow the official documentation for setting up a subscription:</p>
                <a
                  href="https://docs.chain.link/chainlink-functions/resources/subscriptions#create-a-subscription"
                  className="text-blue-700 underline"
                >
                  Chainlink Functions Subscription Guide
                </a>
              </details>

              <blockquote className="border-l-4 border-blue-500 italic mt-6 my-4 pl-4 md:pl-8">
                Setting up your environment correctly is crucial for a smooth experience in building and testing the
                Chainlink integration.
              </blockquote>
            </Checkpoint>

            {/* Checkpoint 1: Testing Chainlink Functions */}
            <Checkpoint title="Checkpoint 1: 🌐 Testing Chainlink Functions 🤖">
              <p>
                Now that you are familiar with your development environment, let&apos;s dive into the exciting world of
                Chainlink Functions!
              </p>
              <p className="mt-4">
                First, visit the{" "}
                <a href="https://functions.chain.link/playground" className="text-blue-700 underline">
                  Chainlink Functions Playground
                </a>
                . This is a powerful tool where you can experiment with various API requests without any coding setup.
              </p>
              <p className="mt-4">
                For our game, <strong>Flip The Coin Crypto</strong>, we'll compare the price of Ethereum (ETH) at two
                different timestamps to decide the outcome of the game. Copy and paste the following code into the
                playground to fetch and compare the ETH prices:
              </p>
              <CodeText>
                {`
const fromTimestamp = args[0];
const toTimestamp = args[1];
const URL_PREVIOUS = \`https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=\` + fromTimestamp;
const URL_CURRENT = \`https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=\` + toTimestamp;
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
console.log(currentEthPrice, previousEthPrice, currentEthPrice>previousEthPrice);
return Functions.encodeUint256(Number(currentEthPrice>previousEthPrice));`}
              </CodeText>

              <p className="mt-4">
                Note: The arguments <code>args[0]</code> and <code>args[1]</code> must be epoch timestamps. For example,
                you can use the following recent timestamps: <code>1685119200</code> and <code>1685122800</code>.
              </p>
              <Image
                src={playgroundImage}
                alt="Chainlink Function Playground"
                layout="responsive"
                className="w-full max-w-2xl mx-auto my-4"
              />
              <p className="mt-4">
                Examine the response you receive. Understanding how to retrieve and handle this data is crucial for the
                logic of our game.
              </p>
              <p className="mt-4">
                To run the code locally, we must do some adaptations. Check out the code in{" "}
                <code>ethOracleSource.js</code> located in the <code>scripts</code> folder.
              </p>
              <p className="mt-4">
                Once you’re comfortable with the API call, you’re ready to integrate this functionality into our game in
                the upcoming checkpoints.
              </p>
            </Checkpoint>

            {/* Checkpoint 2: Building the Oracle Contract */}
            <Checkpoint title="Checkpoint 2: 🛠 Building the Oracle Contract 🌐">
              <p>
                In this section, you&apos;ll integrate a key function into the oracle contract to handle the API
                response. This capability is central to our Flip The Coin Crypto game, as it processes and utilizes the
                real-time Ethereum price data retrieved by Chainlink.
              </p>
              <p className="mt-4">
                You&apos;ll focus on implementing the <code>fulfillRequest</code> function in the smart contract. This
                function is critical, as Chainlink will automatically call it to pass the data once the API request is
                completed.
              </p>

              <p className="mt-4">
                <strong>
                  Add the following function to your oracle at <code>packages/hardhat/contracts/ETHOracle.sol</code>:
                </strong>
              </p>
              <CodeText>
                {`function fulfillRequest(
    bytes32 requestId,
    bytes memory response,
    bytes memory err
) internal override {
    if (s_lastRequestId != requestId) {
        revert UnexpectedRequestID(requestId);
    }

    s_lastResponse = response;
    s_lastError = err;

    (
        bool priceIncreased,
        uint256 previousTimestamp,
        uint256 currentTimestamp
    ) = abi.decode(response, (bool, uint256, uint256));

    priceIncreasedBetweenTimestamps[previousTimestamp][
        currentTimestamp
    ] = PriceData(priceIncreased, true);

    emit Response(
        requestId,
        priceIncreased,
        previousTimestamp,
        currentTimestamp,
        err
    );
}`}
              </CodeText>

              <p className="mt-4">
                Let&apos;s break down this function step-by-step to understand what each part does:
              </p>

              <h3 className="text-2xl font-semibold">Function Signature</h3>
              <p>
                The function signature is:
                <code>
                  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override
                </code>
                . It takes three parameters:
                <p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>requestId</strong>: A unique identifier for the data request. This ensures that the
                      response corresponds to the correct request.
                    </li>
                    <li>
                      <strong>response</strong>: The raw Ethereum price data returned by the API. This data is encoded
                      and needs to be decoded to be useful.
                    </li>
                    <li>
                      <strong>err</strong>: Any error message returned by the API. This helps in debugging and
                      understanding if something went wrong.
                    </li>
                  </ul>
                </p>
              </p>
              <h3 className="text-2xl font-semibold">Check Request ID</h3>
              <p>
                The first line inside the function checks if the <code>requestId</code> matches the last request ID
                stored in <code>s_lastRequestId</code>. This ensures that the response being processed is for the
                correct request:
              </p>
              <CodeText>{`if (s_lastRequestId != requestId) {
    revert UnexpectedRequestID(requestId);
}`}</CodeText>
              <p>
                If the IDs do not match, it reverts the transaction with an error <code>UnexpectedRequestID</code>. This
                is an important security check to prevent processing incorrect data.
              </p>

              <h3 className="text-2xl font-semibold">Store the Response and Error</h3>
              <p>
                The function then stores the response and any error in the state variables <code>s_lastResponse</code>{" "}
                and <code>s_lastError</code> respectively:
              </p>
              <CodeText>{`s_lastResponse = response;
s_lastError = err;`}</CodeText>
              <p>This allows the contract to keep track of the latest data received and any associated errors.</p>

              <h3 className="text-2xl font-semibold">Decode the Response</h3>
              <p>
                The next step is to decode the response data. The response contains whether the price increased, the
                previous timestamp, and the current timestamp:
              </p>
              <CodeText>{`(
    bool priceIncreased,
    uint256 previousTimestamp,
    uint256 currentTimestamp
) = abi.decode(response, (bool, uint256, uint256));`}</CodeText>
              <p>
                The <code>abi.decode</code> function is used to decode the response from bytes into the respective
                types. Here, it decodes into a boolean indicating if the price increased, and two timestamps.
              </p>

              <h3 className="text-2xl font-semibold">Store Price Data</h3>
              <p>
                The decoded data is then stored in a mapping <code>priceIncreasedBetweenTimestamps</code>:
              </p>
              <CodeText>{`priceIncreasedBetweenTimestamps[previousTimestamp][
    currentTimestamp
] = PriceData(priceIncreased, true);`}</CodeText>
              <p>
                This mapping keeps track of whether the price increased between two specific timestamps. The{" "}
                <code>PriceData</code> struct is used to store this information.
              </p>

              <h3 className="text-2xl font-semibold">Emit Event</h3>
              <p>
                Finally, the function emits a <code>Response</code> event with all the relevant data:
              </p>
              <CodeText>{`emit Response(
    requestId,
    priceIncreased,
    previousTimestamp,
    currentTimestamp,
    err
);`}</CodeText>
              <p>
                Emitting events is a way to log information on the blockchain. This event can be listened to by
                off-chain applications to know when the data has been processed and is available.
              </p>

              <h3 className="text-2xl font-semibold">Summary</h3>
              <p>
                The <code>fulfillRequest</code> function is essential for processing the API response. It ensures that
                the response is for the correct request, stores the response and any errors, decodes the data, updates
                the contract's state, and emits an event with the processed data.
              </p>
            </Checkpoint>

            {/* Checkpoint 3: Deploy Your Contract */}
            <Checkpoint title="Checkpoint 3: 💾 Deploy Your Contract! 🛰">
              <p>
                🚀 Ready to launch your smart contract onto the public testnet? Follow these steps to deploy to Sepolia:
              </p>
              <p className="mt-4">
                <strong>1. Generate a Deployer Address:</strong> Use Yarn to generate a new deployer address. This
                command creates a unique deployer address and saves the mnemonic locally, avoiding the need to use your
                personal private key.
              </p>
              <CodeText>{"yarn generate"}</CodeText>
              <p className="mt-4">
                <strong>2. Check Your Account:</strong> Confirm the balance of your new deployer account with:
              </p>
              <CodeText>{"yarn account"}</CodeText>
              <p className="mt-4">
                <strong>3. Fund Your Account:</strong> Ensure your deployer address has enough ETH for deployment.
                Obtain ETH from:
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <a href="https://sepoliafaucet.com/" className="text-blue-700 underline">
                      Sepolia Faucet
                    </a>
                  </li>
                  <li>
                    <a href="https://www.infura.io/faucet/sepolia" className="text-blue-700 underline">
                      Infura Sepolia Faucet
                    </a>
                  </li>
                </ul>
              </p>
              <p className="mt-4">
                <strong>4. Deploy Your Contract:</strong> Deploy your smart contract to Sepolia using the following
                command:
              </p>
              <CodeText>{"yarn deploy --network sepolia"}</CodeText>
              <p className="mt-4">
                💬 <strong>Hint:</strong> You can set the <code>defaultNetwork</code> in <code>hardhat.config.ts</code>{" "}
                to sepolia or specify the network directly in the deploy command with{" "}
                <code>yarn deploy --network sepolia</code>.
              </p>
              <blockquote className="border-l-4 border-blue-500 italic my-4 pl-4 md:pl-8">
                Keeping a{" "}
                <a href="https://punkwallet.io" className="text-blue-700 underline">
                  punkwallet.io
                </a>{" "}
                on your phone loaded with testnet ETH can be a handy trick during development. 🧙‍♂️ You&apos;ll look like
                a wizard when you can fund your deployer address from your phone in seconds.
              </blockquote>

              <p className="mt-4">
                <strong>5. Add a Consumer to Your Subscription:</strong> Once your subscription is funded, the next step
                is to add a consumer. Go to{" "}
                <a href="https://functions.chain.link" className="text-blue-700 underline">
                  functions.chain.link
                </a>
                , click on <strong>Add consumer</strong>. Then, enter the address of the consumer contract that you
                deployed earlier. MetaMask will prompt you to confirm the transaction.
              </p>

              <Image
                src={addConsumerImage}
                alt="Add Consumer Screenshot"
                layout="responsive"
                className="w-3/4 max-w-xl mx-auto my-4"
              />

              <p>Your subscription creation and configuration are now complete.</p>
            </Checkpoint>

            {/* Checkpoint 4: Test the Game */}
            <Checkpoint title="Checkpoint 4: 🎮 Test the Game">
              <p>Before proceeding, let's test the game locally to ensure everything is set up correctly.</p>
              <p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Open your browser and navigate to{" "}
                    <a href="http://localhost:3000/challenge" className="text-blue-700 underline">
                      http://localhost:3000/challenge
                    </a>
                    .
                  </li>
                  <li>Ensure the game interface loads correctly.</li>
                  <li>Interact with the game by placing a bet.</li>
                  <li>Observe the response to see if the game behaves as expected.</li>
                </ol>
              </p>
              <Image
                src={gameScreenshot}
                alt="Flip The Coin Game Screenshot"
                layout="responsive"
                className="w-1/4 max-w-xs mx-auto my-4"
              />
              <p className="mt-4">
                Ensure that the game interface loads correctly, and test placing a bet to see if the game responds as
                expected. This step is crucial to confirm that your smart contracts and frontend are working together
                seamlessly.
              </p>
            </Checkpoint>

            {/* Checkpoint 5: Ship Your Frontend */}
            <Checkpoint title="Checkpoint 5: 🚢 Ship Your Frontend! 🚁">
              <p>
                Now that your smart contract is live on the Sepolia testnet, it’s time to prepare and deploy your
                frontend to interact with it.
              </p>

              <p className="mt-4">
                <strong>1. Configure the Frontend:</strong> Start by setting the target network in your Next.js
                configuration to ensure the frontend connects to the right network.
              </p>
              <CodeText>
                {`// packages/nextjs/scaffold.config.ts
module.exports = {
  targetNetwork: 'chains.sepolia'
}`}
              </CodeText>

              <p className="mt-4">
                Ensure the network change reflects correctly in your frontend by visiting{" "}
                <a href="http://localhost:3000" className="text-blue-700 underline">
                  http://localhost:3000
                </a>
                . You should see Sepolia as the active network.
              </p>

              <p className="mt-4">
                <strong>2. Adjust Wallet Settings:</strong> Since we are now operating on a public testnet, you need to
                connect using a wallet you control. Configure the burner wallet settings in your frontend config:
              </p>
              <CodeText>
                {`// packages/nextjs/scaffold.config.ts
module.exports = {
  onlyLocalBurnerWallet: false
}`}
              </CodeText>

              <p className="mt-4">
                This change allows the use of burner wallets on any network, not just the local environment.
              </p>

              <p className="mt-4">
                <strong>3. Optimize Event Loading:</strong> To enhance the loading times for transaction data, update
                the <code>fromBlock</code> to a recent number in the event hooks of your frontend:
              </p>
              <CodeText>
                {`// packages/nextjs/app/transfers/page.tsx
useScaffoldEventHistory({ fromBlock: 3750241n }) // Replace 3750241n with the block number where your contract was deployed`}
              </CodeText>

              <p className="mt-4">
                <strong>4. Deploy on Vercel:</strong> Deploy your frontend to the cloud with Vercel to make it
                accessible online.
              </p>
              <CodeText>{"yarn vercel"}</CodeText>

              <p className="mt-4">
                Follow the prompts to log in and deploy. Use <code>yarn vercel --prod</code> to deploy directly to your
                production URL or omit the <code>--prod</code> flag for a preview URL.
              </p>

              <p className="mt-4">
                <strong>5. Run Tests:</strong> Before finalizing your deployment, ensure your app functions correctly by
                running automated tests.
              </p>
              <CodeText>{"yarn test"}</CodeText>

              <p className="mt-4">
                <strong>6. Secure API Keys:</strong> For production-grade applications, secure your own API keys for
                services like Alchemy and Etherscan to avoid rate limiting:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Add your ALCHEMY_API_KEY in <code>.env</code> files within the Hardhat and Next.js packages.
                </li>
                <li>
                  Add your ETHERSCAN_API_KEY in the Hardhat package&apos;s <code>.env</code> file.
                </li>
              </ul>

              <blockquote className="border-l-4 border-blue-500 italic my-4 pl-4 md:pl-8">
                💬 <strong>Hint:</strong> It&apos;s recommended to manage environment variables in Vercel&apos;s system
                for live apps, and use <code>.env.local</code> for local testing.
              </blockquote>
            </Checkpoint>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
