import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : "dev";
  const [deployer] = await ethers.getSigners();
  console.log("deploy from address: ", deployer.address);

  const AIInference = await ethers.getContractFactory("MockAIInference");
  const accountId = "1";
  const requestResponseCoordinator =
    "0x2b5AfBC3d4ccddb438b571Dc1A6FE36ADb76d65D";
  const weth = "0x4200000000000000000000000000000000000006";
  const uniswapV3Router = "0x6ff5693b99212da76ad316178a184ab56d299b43";
  const usdcTokenAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const inference = await AIInference.deploy(
    requestResponseCoordinator,
    weth,
    uniswapV3Router,
    usdcTokenAddress
  );
  console.log("AIInference address: ", inference.address);
  Config.setConfig(network + ".aiInference", inference.address);

  await Config.updateConfig();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
