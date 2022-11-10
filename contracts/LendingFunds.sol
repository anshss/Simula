//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingFunds is Ownable{

    uint256 bal;
    mapping (address => bool) public controller;

    function transferFunds(address user, uint256 amount) public {
        require(controller[msg.sender], "only controller can use this function");
        payable(user).transfer(amount);
    }

    function withdraw() external onlyOwner {
         payable(owner()).transfer(address(this).balance);
    }

    function addController(address _user) public onlyOwner {
        controller[_user] = true;
    }

    function removeController(address _user) public onlyOwner {
        controller[_user] = false;
    }

    receive() external payable {}

    fallback() external payable {}

}