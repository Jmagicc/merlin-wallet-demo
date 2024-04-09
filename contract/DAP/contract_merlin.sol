// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
}

contract PointsSystem is IERC20 {
    string public constant name = "DAPoint";
    string public constant symbol = "DAP";
    uint8 public constant decimals = 18;

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    uint256 totalSupply_;

    address private owner;
    bytes32 public distributionRoot;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(uint256 total, bytes32 root) {
        totalSupply_ = total;
        owner = msg.sender;
        balances[msg.sender] = totalSupply_;
        distributionRoot = root;
    }

    function totalSupply() public override view returns (uint256) {
        return totalSupply_;
    }

    function mint(uint256 mintTotal) public onlyOwner {
        totalSupply_ += mintTotal;
        balances[owner] += mintTotal;
    }

    function balanceOf(address tokenOwner) public override view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] -= numTokens;
        balances[receiver] += numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address _owner, address delegate) public override view returns (uint256) {
        return allowed[_owner][delegate];
    }

    function transferFrom(address _owner, address buyer, uint256 numTokens) public override returns (bool) {
        require(numTokens <= balances[_owner], "Insufficient balance");
        require(numTokens <= allowed[_owner][msg.sender], "Insufficient allowance");

        balances[_owner] -= numTokens;
        allowed[_owner][msg.sender] -= numTokens;
        balances[buyer] += numTokens;
        emit Transfer(_owner, buyer, numTokens);
        return true;
    }

    function setDistributionRoot(bytes32 root) public onlyOwner {
        distributionRoot = root;
    }


    function verifyAddressInWhitelist(address account, bytes32[] memory proof) public view returns (bool) {
        bytes32 encodedAccount = keccak256(abi.encodePacked(account));
        return MerkleProof.verify(proof, distributionRoot, encodedAccount);
    }

    function distributePoints(uint256 amount, address[] memory accounts) public onlyOwner {
        require(balances[owner] >= amount * accounts.length, "Insufficient balance");
        for (uint256 i = 0; i < accounts.length; i++) {
            bytes32 leafHash = keccak256(abi.encodePacked(accounts[i]));
            bytes32[] memory proof = new bytes32[](1);
            proof[0] = leafHash;

            if (MerkleProof.verify(proof, distributionRoot, keccak256(abi.encodePacked(accounts[i])))) {
                balances[owner] -= amount;
                balances[accounts[i]] += amount;
                emit Transfer(owner, accounts[i], amount);
            }
        }
    }

    function transferOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}