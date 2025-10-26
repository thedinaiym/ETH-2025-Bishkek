import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys RealEstateFractional contract using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployRealEstateFractional: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("RealEstateFractional", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const realEstateFractional = await hre.ethers.getContract<Contract>("RealEstateFractional", deployer);
  console.log("👋 RealEstateFractional deployed at:", await realEstateFractional.getAddress());
  console.log("📝 Deployer has ADMIN_ROLE:", deployer);
};

export default deployRealEstateFractional;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags RealEstateFractional
deployRealEstateFractional.tags = ["RealEstateFractional"];
