//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ESK20 is ERC20 {
    constructor() ERC20("Eskaine", "ESK20") {
        _mint(msg.sender, 100000);
    }
}
