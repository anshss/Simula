const { ethers } = require("@nomiclabs/hardhat-ethers"); 
const fs = require("fs");
import { contractAddress } from '../address/Lending'

async function main() { 
  const contract = await ethers.getContractFactory("Dao"); 
  const deployedContract = await contract.deploy(contractAddress); 
  await deployedContract.deployed(); 
  
  console.log("Address:", deployedContract.address); 
  fs.writeFileSync('./address/Dao.js', `export const contractAddress = "${deployedContract.address}"`) 
} 

main() 
  .then(() => process.exit(0)) 
  .catch((error) => { 
    console.error(error); 
    process.exit(1); 
  });