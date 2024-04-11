// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract CheckWBTCBalance {
    address  WBTC_ADDRESS = 0xF6D226f9Dc15d9bB51182815b320D3fBE324e1bA;
    address  VOYA_ADDRESS = 0x480E158395cC5b41e5584347c495584cA2cAf78d;


    address private owner;

    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }
    function setWBTCAddress(address newAddress) external onlyOwner {
        WBTC_ADDRESS = newAddress;
    }

    function setVOYAAddress(address newAddress) external onlyOwner {
        VOYA_ADDRESS = newAddress;
    }

    function checkWBTCBalance(address account) public view returns (bool) {
        IERC20 wbtc = IERC20(WBTC_ADDRESS);
        uint256 balance = wbtc.balanceOf(account);
        return balance > 1e16; // Assume that 1e16 are the thresholds for judging whether the balance is sufficient
    }

    function checkVOYACBalance(address account) public view returns (bool) {
        IERC20 voya = IERC20(VOYA_ADDRESS);
        uint256 balance = voya.balanceOf(account);
        return balance > 1e16; // Use the same threshold for judgment
    }

    function checkWBTCBalanceOfSender() public view returns (bool) {
        IERC20 wbtc = IERC20(WBTC_ADDRESS);
        uint256 balance = wbtc.balanceOf(msg.sender);
        return balance > 1e16; // Use the same threshold for judgment
    }

    function checkVOYABalanceOfSender() public view returns (bool) {
        IERC20 voya = IERC20(VOYA_ADDRESS);
        uint256 balance = voya.balanceOf(msg.sender);
        return balance > 1e16; // Use the same threshold for judgment
    }

    function checkWBTCandVOYABalance() public view returns (uint256, uint256) {
        IERC20 wbtc = IERC20(WBTC_ADDRESS);
        uint256 balance_wbtc = wbtc.balanceOf(msg.sender);
        IERC20 voya = IERC20(VOYA_ADDRESS);
        uint256 balance_voya = voya.balanceOf(msg.sender);
        return (balance_wbtc, balance_voya); //Returns the balance of WBTC and VOYA tokens
    }
}