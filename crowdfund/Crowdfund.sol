// SPDX-License-Identifier: GPL-3.0-only
pragma solidity >= 0.8.2;

contract Crowdfund {

    uint end_donate;    // Timestamp of when users can no longer donate
    uint goal;          // amount of hbar that must be donated for the crowdfunding to be succesful
    bytes32 public receiver;   // receiver of the donated funds
    mapping(bytes32 => uint) public donors; // mapping of donors' addresses to their donations
    address payable owner;

    constructor (bytes32 receiver_, uint end_donate_, uint256 goal_) {
        receiver = receiver_;
        end_donate = end_donate_;
        goal = goal_;
        owner = payable(msg.sender);
    }
    
    function donate(bytes32 donorId) public payable {
        require (block.timestamp <= end_donate);
        donors[donorId] += msg.value;
    }

    function withdraw(uint256 amount, bytes32 withdrawerId) public {
        require (block.timestamp >= end_donate, "Withdrawal period has not started");
        require (address(this).balance >= goal);
        require (withdrawerId == receiver, "Only the receiver can withdraw");

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed.");
    }
    
    function reclaim(bytes32 claimerId) public {
        require (block.timestamp >= end_donate, "Reclaim period has not started");
        require (address(this).balance < goal);
        require (donors[claimerId] > 0, "No donation found for the claimer");
        uint amount = donors[claimerId];
        donors[claimerId] = 0;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed.");
    }
}

