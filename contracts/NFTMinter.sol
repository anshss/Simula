//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMinter is ERC721 {

    uint public _tokenId;

    constructor() ERC721("NFTee", "ITM") {}

    function mintMe() public {
        ++_tokenId;
        _mint(msg.sender, _tokenId);
    }

    function mintAddress(address _address) public {
        ++_tokenId;
        _mint(_address, _tokenId);
    }
}