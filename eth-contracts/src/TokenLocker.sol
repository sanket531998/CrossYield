// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./Interfaces.sol";

contract TokenLocker {
    function approveToken(address token, address spender, uint256 amount) external {
        IERC20(token).approve(spender, amount);
    }

    function checkBalance(address token, address user) external view returns (uint256) {
        return IERC20(token).balanceOf(user);
    }
}  
