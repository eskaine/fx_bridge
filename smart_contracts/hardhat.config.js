require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
       chainId: 1337
    },
    goerli: {
      url: "",
      accounts: [""]
    }
 },
};
