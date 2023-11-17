// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bounty {
    uint256 public bountyCount = 0;
    mapping(uint256 => address) public bountyOwner;
    mapping(uint256 => uint256) public bountyAmount;
    mapping(uint256 => BountyContent) public bountyContent;
    // === event ===
    event BountyGiven(
        uint256 bountyId,
        address indexed contributer,
        uint256 amount
    );
    event createBountyEvent(
        uint256 indexed bountyId,
        address indexed bountyOwner,
        uint256 bountyAmount,
        string title,
        string description
    );

    struct BountyContent {
        string title;
        string description;
        uint openStatus;
    }

    // === public storage ===

    // open issue and create bounty
    function createBounty(
        string memory title,
        string memory description
    ) public payable {
        require(msg.value != 0, "Bounty amount must be greater than 0");

        bountyOwner[bountyCount] = msg.sender;
        bountyAmount[bountyCount] = msg.value;
        bountyContent[bountyCount] = BountyContent(title, description, 1);
        bountyCount++;
        emit createBountyEvent(
            bountyCount,
            msg.sender,
            msg.value,
            title,
            description
        );
    }

    function giveBounty(uint256 bountyId, address contributer) internal {
        require(bountyContent[bountyId].openStatus == 1, "Bounty is closed");
        require(contributer != address(0), "Contributer is the zero address");

        uint256 amount = bountyAmount[bountyId];
        require(amount > 0, "Bounty amount is zero");

        bountyContent[bountyId].openStatus = 0;
        payable(contributer).transfer(bountyAmount[bountyId]);

        emit BountyGiven(bountyId, contributer, amount);
    }

    function closeBounty(uint256 bountyId) public {
        require(
            msg.sender == bountyOwner[bountyId],
            "Only bounty owner can close bounty"
        );
        require(bountyContent[bountyId].openStatus == 1, "Bounty is closed");

        bountyContent[bountyId].openStatus = 0;
    }

    // === view ===
    function getBounty(
        uint256 bountyId
    ) external view returns (BountyContent memory, uint256) {
        return (bountyContent[bountyId], bountyAmount[bountyId]);
    }
}
