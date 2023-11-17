// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {SHA1} from "../libraries/SHA1.sol";
import {Bounty} from "./Bounty.sol";

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
    mapping(address => mapping(uint256 => Bundle)) public contributer;
    mapping(bytes20 => bool) public mainCommitExist;
    // === event ===
    event test(
        bytes20 indexed sha,
        Commit commit,
        bytes wc,
        bytes t,
        bytes parent,
        bytes message,
        bytes data,
        string msg
    );

    event contribute(
        address indexed contributer,
        uint256 indexed contributeID,
        Bundle bundle
    );
    event merged(address indexed contributer, Bundle indexed bundle);

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
        bytes20 thisHash; // sha1 hash of the commit
        bytes wordCount; // commit with word count
        bytes20 tree; // sha1 of tree
        bytes20[] parents; // sha
        bytes message; // incloud author, commitor, and commit message
    }

    // @TODO Brnach Name
    struct Request {
        address contributer;
        uint256 linkBounty;
        bytes20 commitHash;
        string bundleUrl;
    }

    struct Bundle {
        string cid;
        bytes20 sha;
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
        mainCommitExist[_commitHash] = true;
    }

    // API 2 : reward request
    function rewardRequest(uint256 bountyId, string memory bundleUrl) public {
        require(
            bountyContent[bountyId].openStatus == 1,
            "bounty is closed or not exist"
        );

        require(
            contributer[msg.sender][contributeCount[msg.sender] - 1].sha ==
                latestCommit,
            "need to contribute to this repo branch"
        );
        uint256 count = contributeCount[msg.sender];

        Request memory request = Request(
            msg.sender,
            bountyId,
            contributer[msg.sender][count].sha,
            bundleUrl
        );
        requests[requestCount] = request;
        requestCount++;
    }

    // API 3 : merge commit to repo
    // @param commit: commit struct
    // @param newHash: bytes20 sha1 hash of the new commit
    // @param parent: bytes20 sha1 hash of the parent commit
    function merge(Commit memory commit) public onlyCodeOwner {
        require(
            commit.thisHash == verifyCommit(commit),
            "need to parent to this branch"
        );
        latestCommit = commit.thisHash;
        mainCommitExist[commit.thisHash] = true;
    }

    // API 4 : push commit to repo
    // @param commits: array of commit struct
    // @param _cid: string of the commit cid
    function push(Commit[] memory commits, string memory _cid) public {
        require(
            mainCommitExist[commits[0].parents[0]] == true,
            "parent commit not exist"
        );
        for (uint256 i = 0; i < commits.length; i++) {
            require(
                commits[i].thisHash == verifyCommit(commits[i]),
                "need to parent to this repo branch"
            );
        }

        Bundle memory bundle = Bundle(
            _cid,
            commits[commits.length - 1].thisHash
        );

        uint256 count = contributeCount[msg.sender];
        contributer[msg.sender][count] = bundle;
        contributeCount[msg.sender] = count + 1;
        emit contribute(msg.sender, count, bundle);
    }

    // === internal ===
    // verify contributor's commit
    // @param commit: commit struct
    function verifyCommit(Commit memory commit) internal returns (bytes20) {
        bytes memory wordCount = abi.encodePacked(
            bytes("commit "),
            abi.encodePacked(commit.wordCount)
        );
        bytes memory tree = abi.encodePacked(
            bytes("tree "),
            bytes20ToHexStr((commit.tree)),
            bytes("\n")
        );

        bytes memory parents = "";
        for (uint256 i = 0; i < commit.parents.length; i++) {
            parents = abi.encodePacked(
                parents,
                bytes("parent "),
                bytes20ToHexStr(commit.parents[i]),
                bytes("\n")
            );
        }
        bytes memory data = abi.encodePacked(
            wordCount,
            tree,
            parents,
            commit.message
        );
        emit test(
            SHA1.sha1(data),
            commit,
            wordCount,
            tree,
            parents,
            commit.message,
            data,
            "test commit"
        );
        return SHA1.sha1(data);
    }

    // === view ===
    function getLatestPack() public view returns (bytes20) {
        return latestCommit;
    }

    function bytes20ToHexStr(
        bytes20 _bytes
    ) public pure returns (bytes memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            str[i * 2] = alphabet[uint(uint8(_bytes[i] >> 4))];
            str[1 + i * 2] = alphabet[uint(uint8(_bytes[i] & 0x0f))];
        }
        return abi.encodePacked(bytes(string(str)));
    }
}
