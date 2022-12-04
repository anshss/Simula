require("@nomicfoundation/hardhat-chai-matchers");
const fs = require('fs'); 
const privateKey = fs.readFileSync(".secret").toString() 
const quicknodeId = fs.readFileSync(".quicknodeId").toString()

module.exports = { 
  defaultNetwork : "hardhat", 
  networks: { 
    hardhat: { 
      chainId: 1337 
    }, 
    mumbai: { 
      url: `https://divine-silent-grass.matic-testnet.discover.quiknode.pro/${quicknodeId}/`,
      accounts: [privateKey] 
    }, 
  }, 
  solidity: { 
    version: "0.8.4", 
  } 
}