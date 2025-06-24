import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : "dev";
  const [deployer] = await ethers.getSigners();
  console.log("deploy from address: ", deployer.address);

  //deploy nft
  const Nft = await ethers.getContractFactory("NFT");
  const nft = await Nft.deploy();
  console.log("Nft address: ", nft.address);
  Config.setConfig(network + ".nft", nft.address);

  const MysteryBox = await ethers.getContractFactory("MysteryBox");
  const accountId = "";
  const vrfCoodinator = "";
  const keyHash = "";
  const mysteryBox = await MysteryBox.deploy(
    accountId,
    vrfCoodinator,
    keyHash,
    nft.address
  );
  await nft.grantRole(await nft.MINTER_ROLE(), mysteryBox.address);
  console.log("MysteryBox address: ", mysteryBox.address);
  Config.setConfig(network + ".mysteryBox", mysteryBox.address);

  await Config.updateConfig();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
