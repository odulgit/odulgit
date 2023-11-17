// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {SHA1} from "../libraries/SHA1.sol";
import {Bounty} from "./Bounty.sol";

contract Git is Bounty {
    //  === public storage ===
    address public factory;
    address public codeOwner;
    bytes20 public latestCommit;
    uint256 public requestCount = 0;
    mapping(uint256 => Request) public requests;
    mapping(bytes20 => string) public cid;
    mapping(address => uint256) public contributeCount;
    mapping(address => mapping(uint256 => bytes20)) public contributer;
    // === event ===
    event test(bytes20 indexed sha, string msg);
    event contribute(address indexed contributer, bytes20 indexed sha);
    event merged(address indexed contributer, bytes20 indexed sha);

    // === constructor ===
    constructor() payable {
        factory = msg.sender;
    }

    // === modifier ===
    modifier onlyCodeOwner() {
        require(msg.sender == codeOwner, "forbidden");
        _;
    }

    modifier onlyIssuerOrCodeOwner(address _issuer) {
        require(
            msg.sender == _issuer || msg.sender == codeOwner,
            "only issuer or code owner"
        );
        _;
    }

    // === struct ===
    // commit struct for git
    struct Commit {
        bytes commit; // commit with word count
        bytes tree; // tree + sha
        bytes message; // left message or gpg sign
    }

    struct Request {
        address contributer;
        uint256 linkBounty;
        bytes20 commitHash;
        string bundleUrl;
    }

    // API 1 : initialize repo (first commit)
    // @param _codeOwner: address of the code owner
    // @param _commitHash: bytes20 sha1 hash of the first commit
    // @param _cid: string of the first commit cid
    function initialize(
        address _codeOwner,
        bytes20 _commitHash,
        string memory _cid
    ) external {
        require(msg.sender == factory, "forbidden");
        codeOwner = _codeOwner;
        latestCommit = _commitHash;

        cid[_commitHash] = _cid;
    }

    // API 2 : create request
    function createRequest(
        uint256 bountyId,
        Commit[] memory commits,
        bytes20[] memory newHashes,
        string memory bundleUrl
    ) public {
        require(
            newHashes.length == commits.length,
            "commit length count must be equal to newHashes length"
        );
        require(
            bountyContent[bountyId].openStatus == 1,
            "bounty is closed or not exist"
        );

        multiCommitPush(commits, newHashes);

        Request memory request = Request(
            msg.sender,
            bountyId,
            newHashes[newHashes.length - 1],
            bundleUrl
        );
        requests[requestCount] = request;
        requestCount++;
    }

    // API 3 : merge commit to repo
    // @param commit: commit struct
    // @param newHash: bytes20 sha1 hash of the new commit
    // @param parent: bytes20 sha1 hash of the parent commit
    function merge(
        Commit memory commit,
        bytes20 newHash,
        bytes20 commitParent
    ) public onlyCodeOwner {
        require(
            newHash == verifyMergeParent(commit, commitParent),
            "need to parent to this branch"
        );
        latestCommit = newHash;
    }

    function push(Commit memory commit, bytes20 newHash) internal {
        require(
            newHash == verifyCommitParent(commit),
            "need to parent to this repo branch"
        );
        uint256 count = contributeCount[msg.sender];
        contributer[msg.sender][count] = newHash;
        contributeCount[msg.sender] = count + 1;
        emit contribute(msg.sender, newHash);
    }

    function multiCommitPush(
        Commit[] memory commits,
        bytes20[] memory newHashes
    ) internal {
        for (uint256 i = 0; i < commits.length; i++) {
            require(
                newHashes[i] == verifyCommitParent(commits[i]),
                "need to parent to this repo branch"
            );
        }
        uint256 count = contributeCount[msg.sender];
        contributer[msg.sender][count] = newHashes[newHashes.length - 1];
        contributeCount[msg.sender] = count + 1;
        emit contribute(msg.sender, newHashes[newHashes.length - 1]);
    }

    // === internal ===
    // verify contributor's commit
    // @param commit: commit struct
    function verifyCommitParent(
        Commit memory commit
    ) internal view returns (bytes20) {
        bytes memory data = abi.encodePacked(
            commit.commit,
            commit.tree,
            bytes("parent"),
            latestCommit,
            bytes("\n"),
            commit.message
        );
        return SHA1.sha1(data);
    }

    function verifyMergeParent(
        Commit memory commit,
        bytes20 parent
    ) internal view returns (bytes20) {
        bytes memory data = abi.encodePacked(
            commit.commit,
            commit.tree,
            bytes("parent"),
            latestCommit,
            bytes("\n"),
            bytes("parent"),
            parent,
            bytes("\n"),
            commit.message
        );
        return SHA1.sha1(data);
    }

    // === view ===
    function getLatestPack() public view returns (bytes20) {
        return latestCommit;
    }
}
