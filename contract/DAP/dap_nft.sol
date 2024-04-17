// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IPointsSystem {
    function verifyAddressInWhitelist(address account, bytes32[] memory proof) external view returns (bool);
}

contract NFTContract is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 public constant MAX_PAID_SUPPLY = 7888;
    uint256 public constant MAX_MINTS_PER_ADDRESS = 5;
    uint256 public paidMintCount;
    uint256 public vipMintCount;
    IPointsSystem pointsSystem;

    uint256 private _totalSupply;
    mapping(address => uint256) public mintedAmount;

    constructor(string memory name, string memory symbol,address pointsSystemAddress) ERC721(name, symbol) Ownable(msg.sender) {
        pointsSystem = IPointsSystem(pointsSystemAddress);
    }


    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function checkIfUserIsWhitelisted(address user, bytes32[] memory proof) public view returns (bool) {
        return pointsSystem.verifyAddressInWhitelist(user, proof);
    }

    function mintNFT(string memory uri, bytes32[] memory proof) public payable nonReentrant {
        require(totalSupply() < MAX_PAID_SUPPLY + vipMintCount, "Max supply reached");

        if (checkIfUserIsWhitelisted(msg.sender, proof)) {
            // VIP minting, no limit on VIP mints
            vipMintCount++;
            uint256 newVIPTokenId = totalSupply() + 1;
            _safeMint(msg.sender, newVIPTokenId);
            _setTokenURI(newVIPTokenId, uri);
            _totalSupply++;
        } else {
            require(mintedAmount[msg.sender] < MAX_MINTS_PER_ADDRESS, "Mint limit per address exceeded");
            require(paidMintCount < MAX_PAID_SUPPLY, "Max paid supply reached");
            require(msg.value >= MINT_PRICE, "Insufficient ETH sent");

            mintedAmount[msg.sender] += 1;
            paidMintCount++;
            uint256 newPaidTokenId = totalSupply() + 1;
            _safeMint(msg.sender, newPaidTokenId);
            _setTokenURI(newPaidTokenId, uri);
            _totalSupply++;

            // Use pay (owner()). transfer (msg. value);
            //Transfer the ETH paid by the user to the address of the contract owner.
            //This approach is generally not a problem, but if the address of the contract owner is a contract address and the function of receiving ETH is not implemented,
            //it may lead to transfer failure. It is recommended to use the call method to transfer ETH, as it is more flexible and secure.
            (bool sent, ) = payable(owner()).call{value: msg.value}("");
            require(sent, "Failed to send Ether");
        }
    }
}