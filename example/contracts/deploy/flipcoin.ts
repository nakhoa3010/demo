import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : "dev";
  const [deployer] = await ethers.getSigners();
  console.log("deploy from address: ", deployer.address);

  const FlipCoin = await ethers.getContractFactory("FlipCoin");
  const accountId = "41";
  const vrfCoodinator = "0x9A2699517c3F9955B64F848e683aaDF4AB7BD54B";
  const keyHash =
    "0x16f30d078cdb35c573cf70cf7f3c74fdbf420e9671bc4df8f9c58822d0b6cd58";
  const flipCoin = await FlipCoin.deploy(accountId, vrfCoodinator, keyHash);
  console.log("FlipCoin address: ", flipCoin.address);
  Config.setConfig(network + ".flipCoin", flipCoin.address);

  await Config.updateConfig();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
