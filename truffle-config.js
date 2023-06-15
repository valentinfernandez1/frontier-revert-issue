require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const pkeys = [
  process.env.PKEY1,
  process.env.PKEY2,
  process.env.PKEY3,
  process.env.PKEY4,
  process.env.PKEY5,
];

module.exports = {
  networks: {
    development: {
      network_id: "*",
      gas: 6700000,
      networkCheckTimeout: 1200000,
      provider: () => {
        const provider = new HDWalletProvider({
          privateKeys: pkeys,                         // Alith, Baltathar, Charleth and Dorothy pkeys should be coming from .env
          providerOrUrl: `http://127.0.0.1:9944`,     // we're using 9944 instead of 7545
          pollingInterval: 6000,                     // 12s / 2
        });
        return provider;
      },
    },
  },
    // Solidity 0.8.0 Compiler
  compilers: {
    solc: {
      version: '^0.8.0',
      settings: {
        evmVersion: 'london',
      },
    },
  }
};
