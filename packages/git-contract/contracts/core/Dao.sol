// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Dao {
    mapping(address => bool) public members;
    mapping(uint256 => uint256) public votes;
    uint256 public threshould = 2;

    function join(address contributor) internal {
        members[contributor] = true;
    }

    function vote(uint256 id) public {
        require(members[msg.sender], "Not a member");
        votes[id] += 1;
    }
}
