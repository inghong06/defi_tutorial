//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20{
    constructor() ERC20("Reward Token", "RT") {
        // initial supply
        _mint(msg.sender, 3000000 *10 **18);
    }
}