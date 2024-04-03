// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract CheckWBTCBalance {
    address constant WBTC_ADDRESS = 0x3FdaCd1C4fCbF43568C5f3d9E674aE9C9ba30847;
    address constant VOYA_ADDRESS = 0xC292F092bcE386d695c05f76a1fC234b9aF32c73;

    function checkWBTCBalance(address account) public view returns (bool) {
        IERC20 wbtc = IERC20(WBTC_ADDRESS);
        uint256 balance = wbtc.balanceOf(account);
        return balance > 1e6; // Assume that 1 e 6 are the thresholds for judging whether the balance is sufficient
    }

    function checkVOYACBalance(address account) public view returns (bool) {
        IERC20 voya = IERC20(VOYA_ADDRESS);
        uint256 balance = voya.balanceOf(account);
        return balance > 1e6; // Use the same threshold for judgment
    }

    function checkWBTCBalanceOfSender() public view returns (bool) {
        IERC20 wbtc = IERC20(WBTC_ADDRESS);
        uint256 balance = wbtc.balanceOf(msg.sender);
        return balance > 1e6; // Use the same threshold for judgment
    }

    function checkVOYABalanceOfSender() public view returns (bool) {
        IERC20 voya = IERC20(VOYA_ADDRESS);
        uint256 balance = voya.balanceOf(msg.sender);
        return balance > 1e6; // Use the same threshold for judgment
    }

    function checkWBTCandVOYABalance() public view returns (uint256, uint256) {
        IERC20 wbtc = IERC20(WBTC_ADDRESS);
        uint256 balance_wbtc = wbtc.balanceOf(msg.sender);
        IERC20 voya = IERC20(VOYA_ADDRESS);
        uint256 balance_voya = voya.balanceOf(msg.sender);
        return (balance_wbtc, balance_voya); //Returns the balance of WBTC and VOYA tokens
    }
}