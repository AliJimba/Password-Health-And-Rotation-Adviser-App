const hre = require("hardhat");

async function main() {
  console.log("Deploying PasswordRegistryContract...");

  const PasswordRegistry = await hre.ethers.getContractFactory("PasswordRegistryContract");
  const passwordRegistry = await PasswordRegistry.deploy();
  await passwordRegistry.waitForDeployment();

  console.log("PasswordRegistryContract deployed to:", await passwordRegistry.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
