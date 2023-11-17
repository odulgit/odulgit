// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {Git} from "./core/Git.sol";

contract GitFactory {
    event deployedAddress(address indexed repo, address indexed owner);
    mapping(uint256 => address) public repos;
    uint256 public repoCount;

    // @param commitHash: bytes20 sha1 hash of the first commit
    // @param cid: string of the first commit cid
    function getRepoAddress(
        bytes20 commitHash,
        string memory cid
    ) public returns (address) {
        Git git = new Git();
        git.initialize(msg.sender, commitHash, cid);
        repos[repoCount] = address(git);
        repoCount++;

        emit deployedAddress(address(git), msg.sender);
        return address(git);
    }
}
