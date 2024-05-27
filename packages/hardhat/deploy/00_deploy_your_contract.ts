import { Contract } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
// import * as fs from "fs";
// import * as path from "path";

const deployMultipleContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // const jsSourcePath = path.join(__dirname, "../scripts/ethOracleSource.js");
  // const jsSource = fs.readFileSync(jsSourcePath, { encoding: "utf8" });

  // const router = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";

  // Deploy ETHOracle (commented out since it's already deployed)
  // await deploy("ETHOracle", {
  //   from: deployer,
  //   args: [router, jsSource],
  //   log: true,
  //   autoMine: true,
  // });

  //0xd12D38dA6580bb45F54a12d07E546aDC08399Fc6
  // const ethOracle = await hre.ethers.getContract<Contract>("ETHOracle", deployer);
  // console.log("ETHOracle deployed to:", ethOracle.target);

  const ethOracleAddress = "0x77E1Bb33d34392b3C0dB5dFFDbADceED752aFC3b";
  const subscriptionId = 2197;

  // Deploy FlipTheCoinContract
  await deploy("FlipTheCoin", {
    from: deployer,
    args: [ethOracleAddress, subscriptionId],
    log: true,
    autoMine: true,
    value: hre.ethers.parseEther("0.01").toString(),
  });

  const flipTheCoinContract = await hre.ethers.getContract<Contract>("FlipTheCoin", deployer);
  //0x43791d2784EB12ba6968E8c7Ce4c954B6c7510aa
  console.log("FlipTheCoin deployed to:", flipTheCoinContract.target);
};

export default deployMultipleContracts;

deployMultipleContracts.tags = ["ETHOracle", "FlipTheCoin"];
// deployMultipleContracts.tags = ["ETHOracle"];
