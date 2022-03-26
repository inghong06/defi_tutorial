//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SolidTokenTwo is ERC20 {
    constructor() ERC20("Solid Token Two", "ST2") {
        _mint(msg.sender, 10000000 * 10**18);
    }

    function mint(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }
}
