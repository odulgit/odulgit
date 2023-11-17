// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bounty {
  function getBounty() public pure returns (uint256) {
    return 1000000000000000000;
  }

  function openIssue() public pure returns (string memory){
    return "openIssue";
  }

  function closeIssue() public pure returns (string memory){
    return "closeIssue";
  }
}
