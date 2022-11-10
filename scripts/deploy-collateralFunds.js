const { ethers } = require("hardhat"); 
const fs = require("fs");

async function main() { 
  const contract = await ethers.getContractFactory("CollateralFunds"); 
  const deployedContract = await contract.deploy(); 
  await deployedContract.deployed(); 
  
  console.log("Address:", deployedContract.address); 
  fs.writeFileSync('./address/CollateralFunds.js', `export const contractAddress = "${deployedContract.address}"`) 
} 

main() 
  .then(() => process.exit(0)) 
  .catch((error) => { 
    console.error(error); 
    process.exit(1); 
  });