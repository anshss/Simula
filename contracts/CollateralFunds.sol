//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";



contract CollateralFunds is Ownable{

    AggregatorV3Interface internal priceFeed;

    constructor() {
        priceFeed = AggregatorV3Interface(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada); //  matic/usd
    }

    function getLatestPrice() public view returns (int) {
        (,int price,,,) = priceFeed.latestRoundData();
        return price;
    }

   IERC20 usdt = IERC20(0xFA31614f5F776eDD6f72Bc00BdEb22Bd4A59A7Db); //usdt contract

    mapping (address => bool) public controller;
    mapping (address => uint256) public userToPaid;

    function transferFunds(address user, uint256 amount) public {
        require(controller[msg.sender], "only controller can use this function");
        uint256 releaseAmount = (40 * amount)/100; //40% of nft value
        uint256 chainlinkDecimals = 10 ** 10;
        uint256 PriceInUsdt = uint256(getLatestPrice()) * chainlinkDecimals; //chainlink fetches native/usdt price
        uint256 usdtAmount = (releaseAmount * PriceInUsdt) / 10**18;
        usdt.approve(address(this), usdtAmount);
        usdt.transferFrom(address(this), user, usdtAmount); //transfers usdt from contract to user
        userToPaid[user] = usdtAmount;
    }

    function returnFunds(address user) public payable {
        uint256 withInterest = (4 * userToPaid[user])/100 + userToPaid[user]; //4% interest
        usdt.approve(user, withInterest);
        require(usdt.balanceOf(address(this)) >= withInterest, "contract does not hold enough funds");
        usdt.transferFrom(user, address(this), withInterest); //trasnfers usdt from user to contract
        delete userToPaid[user];
    }

    function usdtBalance() public view returns (uint256) {
        return usdt.balanceOf(address(this));
    }

    function withdraw() external onlyOwner {
         usdt.transferFrom(address(this), msg.sender, usdt.balanceOf(address(this)));
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