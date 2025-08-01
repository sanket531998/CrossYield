// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Interfaces.sol";

contract CrossYieldHTLC {
    struct Lock {
        address sender;
        address receiver;
        address token;
        uint256 amount;
        bytes32 hashlock;
        uint256 timelock;
        bool withdrawn;
        bool refunded;
        bytes32 preimage;
    }

    mapping(bytes32 => Lock) public locks;

    event Locked(bytes32 indexed id, address indexed sender, address indexed receiver, address token, uint256 amount, bytes32 hashlock, uint256 timelock);
    event Claimed(bytes32 indexed id, bytes32 preimage);
    event Refunded(bytes32 indexed id);

    function lock(
        bytes32 id,
        address receiver,
        address token,
        uint256 amount,
        bytes32 hashlock,
        uint256 timelock
    ) external {
        require(locks[id].sender == address(0), "Lock already exists");
        require(timelock > block.timestamp, "Timelock must be in future");

        // Transfer tokens from sender to this contract
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        locks[id] = Lock({
            sender: msg.sender,
            receiver: receiver,
            token: token,
            amount: amount,
            hashlock: hashlock,
            timelock: timelock,
            withdrawn: false,
            refunded: false,
            preimage: 0x0
        });

        emit Locked(id, msg.sender, receiver, token, amount, hashlock, timelock);
    }

    function claim(bytes32 id, bytes32 preimage) external {
        Lock storage l = locks[id];
        require(l.sender != address(0), "No such lock");
        require(!l.withdrawn, "Already withdrawn");
        require(!l.refunded, "Already refunded");
        require(keccak256(abi.encodePacked(preimage)) == l.hashlock, "Invalid preimage");

        l.withdrawn = true;
        l.preimage = preimage;

        require(IERC20(l.token).transfer(l.receiver, l.amount), "Transfer failed");
        emit Claimed(id, preimage);
    }

    function refund(bytes32 id) external {
        Lock storage l = locks[id];
        require(l.sender != address(0), "No such lock");
        require(!l.withdrawn, "Already withdrawn");
        require(!l.refunded, "Already refunded");
        require(block.timestamp >= l.timelock, "Timelock not expired");

        l.refunded = true;
        require(IERC20(l.token).transfer(l.sender, l.amount), "Refund failed");
        emit Refunded(id);
    }
}
