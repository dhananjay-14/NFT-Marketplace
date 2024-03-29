require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config()
const fs = require('fs');
const privateKey = [process.env.REACT_APP_PRIVATE_KEY];
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/RtI5AFhtdhh3qnwUv9Ezk-YUdpELilIm",
      accounts:privateKey
    },
    sepolia: {
      url:"https://eth-sepolia.g.alchemy.com/v2/4bVgYx8CkMgpl_iLF8F2syw1na6BX7ee",
      accounts:privateKey
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};