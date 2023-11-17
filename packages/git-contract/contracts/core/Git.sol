// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {SHA1} from "../libraries/SHA1.sol";
import {Bounty} from "./Bounty.sol";
import {Bounty} from "./Bounty.sol";

contract Git is Bounty {
contract Git is Bounty {
    //  === public storage ===
    address public factory;
    address public codeOwner;
    bytes20 public latestCommit;
    // @TODO: name of the repo
    // @TODO: description of the repo (can edit)
    // @TODO: issue count
    // @TODO: issue content
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
        bytes20 newHash; // sha1 hash of the commit
        bytes commit; // commit with word count
        bytes tree; // tree + sha
        bytes message; // left message or gpg sign
    }

    // @TODO Brnach Name
    struct Request {
        address contributer;
        uint256 linkBounty;
        bytes20 commitHash;
        string bundleUrl;
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

    // API 2 : reward request
    function rewardRequest(uint256 bountyId, string memory bundleUrl) public {
        require(
            bountyContent[bountyId].openStatus == 1,
            "bounty is closed or not exist"
            bountyContent[bountyId].openStatus == 1,
            "bounty is closed or not exist"
        );

        require(
            contributer[msg.sender][contributeCount[msg.sender] - 1] ==
                latestCommit,
            "need to contribute to this repo branch"
        );
        uint256 count = contributeCount[msg.sender];

        Request memory request = Request(
            msg.sender,
            bountyId,
            contributer[msg.sender][count],
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
        bytes20 commitParent
    ) public onlyCodeOwner {
        require(
            commit.newHash == verifyMergeParent(commit, commitParent),
            "need to parent to this branch"
        );
        latestCommit = commit.newHash;
    }

    function testpush(Commit memory commit) public {}

    function push(Commit memory commit, string memory _cid) public {
        require(
            commit.newHash == verifyCommitParent(commit),
            "need to parent to this repo branch"
        );
        uint256 count = contributeCount[msg.sender];
        contributer[msg.sender][count] = commit.newHash;
        contributeCount[msg.sender] = count + 1;
        emit contribute(msg.sender, commit.newHash);
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
        string memory _cid
    ) public {
        for (uint256 i = 0; i < commits.length; i++) {
            require(
                commits[i].newHash == verifyCommitParent(commits[i]),
                "need to parent to this repo branch"
            );
        }
        uint256 count = contributeCount[msg.sender];
        contributer[msg.sender][count] = commits[commits.length - 1].newHash;
        contributeCount[msg.sender] = count + 1;
        emit contribute(msg.sender, commits[commits.length - 1].newHash);
    }

    // === internal ===
    // verify contributor's commit
    // @param commit: commit struct
    function verifyCommitParent(
        Commit memory commit
    ) internal returns (bytes20) {
        bytes memory data = abi.encodePacked(
            commit.commit,
            commit.tree,
            bytes("parent"),
            latestCommit,
            bytes("\n"),
            commit.message
        );
        emit test(SHA1.sha1(data), "test");
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
