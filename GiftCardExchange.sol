// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GiftCardEscrow {
    address public buyer;
    address public seller;
    address public escrowAgent;
    uint public giftCardValue;
    bool public isGiftCardDelivered;
    bool public isBuyerRefunded;

    event Deposit(address indexed buyer, uint amount);
    event GiftCardDelivered(address indexed seller);
    event Refund(address indexed buyer, uint amount);

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only the buyer can call this function");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only the seller can call this function");
        _;
    }

    modifier onlyEscrowAgent() {
        require(
            msg.sender == escrowAgent,
            "Only the escrow agent can call this function"
        );
        _;
    }

    constructor(address _seller, uint _giftCardValue) {
        buyer = msg.sender;
        seller = _seller;
        escrowAgent = msg.sender; // Initially set escrow agent as buyer, can be updated later
        giftCardValue = _giftCardValue;
        isGiftCardDelivered = false;
        isBuyerRefunded = false;
    }

    function deposit() external payable onlyBuyer {
        require(
            msg.value == giftCardValue,
            "Deposit must be equal to the gift card value"
        );
        emit Deposit(msg.sender, msg.value);
    }

    function confirmDelivery() external onlyBuyer {
        require(
            address(this).balance == giftCardValue,
            "Escrow does not have the required funds"
        );
        isGiftCardDelivered = true;
        payable(seller).transfer(giftCardValue);
        emit GiftCardDelivered(seller);
    }

    function refundBuyer() external onlyEscrowAgent {
        require(
            !isGiftCardDelivered,
            "Gift card already delivered, refund not possible"
        );
        require(
            address(this).balance == giftCardValue,
            "Escrow does not have the required funds"
        );
        isBuyerRefunded = true;
        payable(buyer).transfer(giftCardValue);
        emit Refund(buyer, giftCardValue);
    }

    function updateEscrowAgent(address newEscrowAgent) external onlyBuyer {
        escrowAgent = newEscrowAgent;
    }
}
