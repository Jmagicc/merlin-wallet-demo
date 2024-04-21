// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";


contract NFTContract is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public constant MINT_PRICE = 0.0001 ether;
    uint256 private constant TIME_DURATION = 14400; // 4 hours
    uint256 public startTime;
    uint256 public endTime;
    uint256 public paidMintCount;
    uint256 public tokenId;
    uint256 public wlMintCount;
    bytes32 public distributionRoot;


    // VIP address can mint quantity
    mapping(address => int256) mintAccountMap;

    uint256 private _totalSupply; // Currently issued NFT, including NFT purchased through VIP and non-VIP channels


    constructor(string memory name, string memory symbol, bytes32 root,uint256 start_tm) ERC721(name, symbol) Ownable(msg.sender) {
        distributionRoot=root;
        _totalSupply = 8888;
        tokenId = 0;
        startTime = start_tm;
        endTime =  startTime + TIME_DURATION;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
    function setDistributionRoot(bytes32 root) public onlyOwner {
        distributionRoot = root;
    }
    function verifyAddressInWhitelist(address account, bytes32[] memory proof) public view returns (bool) {
        bytes32 encodedAccount = keccak256(abi.encodePacked(account));
        return MerkleProof.verify(proof, distributionRoot, encodedAccount);
    }

    function checkIfUserIsWhitelisted(address user, bytes32[] memory proof) public view returns (bool) {
        return verifyAddressInWhitelist(user, proof);
    }

    //    uint256 amount = 2;         Actual can mint quantity = amount
    function setVipAddressLimit(address[] memory addresses, int256 amount) external onlyOwner {
        require(addresses.length > 0, "Addresses array is empty");
        require(amount > 1, "Amount must be greater than or equal to 1");

        for (uint256 i = 0; i < addresses.length; i++) {
            mintAccountMap[addresses[i]] = 1 - amount;
        }
    }

    function getAddressLimit(address addr) view external onlyOwner returns (int256) {
        return mintAccountMap[addr];
    }

    function mintNFT(string memory uri, bytes32[] memory proof) public payable nonReentrant {
        require(block.timestamp > startTime,"Time has not started yet");
        require(wlMintCount + paidMintCount <= totalSupply(), "Maximum supply reached");
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