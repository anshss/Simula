const { ethers } = require("@nomiclabs/hardhat-ethers"); 
const fs = require("fs"); 
import { contractAddress } from '../address/LendingFunds'

async function main() { 
  const contract = await ethers.getContractFactory("Lending"); 
  const deployedContract = await contract.deploy(contractAddress); 
  await deployedContract.deployed(); 
  
  console.log("Address:", deployedContract.address); 
  fs.writeFileSync('./address/Lending.js', `export const contractAddress = "${deployedContract.address}"`) 
} 

main() 
  .then(() => process.exit(0)) 
  .catch((error) => { 
    console.error(error); 
    process.exit(1); 
  });