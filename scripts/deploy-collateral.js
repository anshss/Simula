const { ethers } = require("hardhat");  
const fs = require("fs");

async function main() { 
  const contract = await ethers.getContractFactory("Collateral"); 
  const deployedContract = await contract.deploy(0x1FE19B74929369606e4aF5A8a4b02F708924AeF9); 
  await deployedContract.deployed(); 
  
  console.log("Address:", deployedContract.address); 
  fs.writeFileSync('./address/Collateral.js', `export const contractAddress = "${deployedContract.address}"`) 
} 

main() 
  .then(() => process.exit(0)) 
  .catch((error) => { 
    console.error(error); 
    process.exit(1); 
  });