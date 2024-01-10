//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collateral.sol";
import "./CollateralFunds.sol";
import "./Dao.sol";
import "./Lending.sol";

contract RegistrySimula {

    Collateral public collateral;
    CollateralFunds public collateralFunds;
    Dao public dao;
    Lending public lending;

    constructor() {
        collateralFunds = new CollateralFunds();
        collateral = new Collateral(address(collateralFunds));
        lending = new Lending();
        dao = new Dao(address(lending));
    }
    
}