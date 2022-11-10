const { ethers } = require("@nomiclabs/hardhat-ethers"); 
const fs = require("fs"); 

async function main() { 
  const contract = await ethers.getContractFactory("LendingFunds"); 
  const deployedContract = await contract.deploy(); 
  await deployedContract.deployed(); 
  
  console.log("Address:", deployedContract.address); 
  fs.writeFileSync('./address/LendingFunds.js', `export const contractAddress = "${deployedContract.address}"`) 
} 

main() 
  .then(() => process.exit(0)) 
  .catch((error) => { 
    console.error(error); 
    process.exit(1); 
  });