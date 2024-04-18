// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IPointsSystem {
    function verifyAddressInWhitelist(address account, bytes32[] memory proof) external view returns (bool);
}

contract NFTContract is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 private constant TIME_DURATION = 14400; // 4 hours
    uint256 public startTime;
    uint256 public endTime;
    uint256 public paidMintCount;
    uint256 public tokenId;
    uint256 public wlMintCount;
    IPointsSystem pointsSystem;

    // VIP address can mint quantity
    mapping(address => int256) mintAccountMap;

    uint256 private _totalSupply; // Currently issued NFT, including NFT purchased through VIP and non-VIP channels

    constructor(string memory name, string memory symbol, address pointsSystemAddress) ERC721(name, symbol) Ownable(msg.sender) {
        pointsSystem = IPointsSystem(pointsSystemAddress);
        _totalSupply = 8888;
        tokenId = 0;
        startTime = 0;
    }

    function startSale() public onlyOwner {
        startTime = block.timestamp;
        endTime = startTime + TIME_DURATION;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function checkIfUserIsWhitelisted(address user, bytes32[] memory proof) public view returns (bool) {
        return pointsSystem.verifyAddressInWhitelist(user, proof);
    }

    //    ["0x05Ab5025Fe3f0a0d26fcd5201448D0Ffb16370df", "0x121e33197fa468de29e294e66be1a72e89a8472e", "0x1b8F7EEfcf7773bf1E8682894c4caA8e7A8f404e", "0x52474d9D1df3cf8293e47bd64B146F61c4Db5f13", "0x529B39b21fe590618bac914797D0f8c08560961A", "0x6b26f3cedfe85ca25280c30200148da12e9c11a6", "0x7d25dbFfFFec79B9f41014B911AAB218e1bB47dB", "0x8668B818959a5fbc2687080F4f62D1D8699EF78c", "0x9e18c807F0b5793fc3c596048351F9A2D1D747E3", "0xb17Dc4c21961fDeDF65AAA634c8ee8586b7dd81e", "0xcfefc97d1d1b7bd172a0399d0c64d4f32bdad6ee"]
    //    uint256 amount = -2;         Actual can mint quantity = amount
    function setVipAddressLimit(address[] memory addresses, int256 amount) external onlyOwner {
        require(addresses.length > 0, "Addresses array is empty");
        require(amount >= 0, "Amount must be greater than or equal to 0");

        for (uint256 i = 0; i < addresses.length; i++) {
            mintAccountMap[addresses[i]] = 1 - amount;
        }
    }

    function getAddressLimit(address addr) view external onlyOwner returns (int256) {
        return mintAccountMap[addr];
    }

    function mintNFT(string memory uri, bytes32[] memory proof) public payable nonReentrant {
        require(startTime > 0);
        require(block.timestamp > startTime);
        require(wlMintCount + paidMintCount < totalSupply(), "Maximum supply reached");
        require(mintAccountMap[msg.sender] < 1);

        bool isWlUser = checkIfUserIsWhitelisted(msg.sender, proof);

        if (block.timestamp <= endTime && paidMintCount > 6888) {
            // reserve 2000 for white list users to get through
            if (!isWlUser) {
                return;
            }
        }

        // Within Wl USER reserved mint time window
        if (isWlUser) {
            wlMintCount++;
        } else {
            require(msg.value >= MINT_PRICE, "Insufficient merlin btc sent");

            (bool sent, ) = payable(owner()).call{value: msg.value}("");
            require(sent, "Failed to send merlin btc");
            paidMintCount++;
        }

        mintAccountMap[msg.sender]++;
        _safeMint(msg.sender, tokenId);
        tokenId++;
        _setTokenURI(tokenId, uri);
    }

    function getMintedAmounts() public onlyOwner view returns (uint256, uint256) {
        return (wlMintCount, paidMintCount);
    }
}