//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract ESK721 is ERC721Pausable {
    address public owner;
    bool private _paused;

    using Counters for Counters.Counter;
    Counters.Counter private _ids;

    event NFTMinted(address owner, uint256 id);
    event NFTBurned(uint256 id);
    event NFTTransferred(address owner, uint256 id);

    constructor() ERC721("Eskaine", "ESK721") {
        owner = msg.sender;
        _paused = false;
    }

    function mintNFT()
        public
    {
        uint256 id = _ids.current();
        _mint(msg.sender, id);

        _ids.increment();
        emit NFTMinted(msg.sender, id);
    }

    function burnNFT(uint256 id) public {
        require(ownerOf(id) == msg.sender, "Only owner can burn");
        _burn(id);
        emit NFTBurned(id);
    }

    function transferNFT(
        address from,
        address to,
        uint256 id
    ) public {
        require(!_paused, "Token transfer paused");
        _transfer(from, to, id);
        emit NFTTransferred(to, id);
    }

    function setPaused(bool paused) public {
        require(msg.sender == owner, "You are not the owner");
        _paused = paused;
    }
}
