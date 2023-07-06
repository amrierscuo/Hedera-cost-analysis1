// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

contract SimpleTransfer {
    bytes32 public recipient;
    address payable owner;

    constructor(bytes32 _recipient) {
        recipient = _recipient;
        owner = payable(msg.sender);
    }

    function deposit() public payable {
        require(msg.sender == owner, "only the owner can deposit");
    }

    function withdraw(uint256 amount, bytes32 withdrawerId) public {
        require(recipient == withdrawerId, "only the recipient can withdraw");
        require(amount <= address(this).balance, "the contract balance is less then required amount");

        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed.");
    }

    function getRecipient() public view returns (bytes32) {
        return recipient;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
