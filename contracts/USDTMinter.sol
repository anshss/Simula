// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract USDTMinter is ERC20 {

    constructor() ERC20("US Dollar", "USDT") {
        _mint(msg.sender, 1000 * 10 ** 18);
    }

}