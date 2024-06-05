// Contract ABI and Address
const contractABI = [
  {
    inputs: [
      { internalType: "address", name: "_seller", type: "address" },
      { internalType: "uint256", name: "_giftCardValue", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
    ],
    name: "GiftCardDelivered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Refund",
    type: "event",
  },
  {
    inputs: [],
    name: "buyer",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmDelivery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "escrowAgent",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "giftCardValue",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isBuyerRefunded",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isGiftCardDelivered",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "refundBuyer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "seller",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newEscrowAgent", type: "address" },
    ],
    name: "updateEscrowAgent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contractAddress = "0xf58b266e05c34be7c7b024f29ee46de5c56504ce";

// Web3 Initialization
let web3;
let contract;
let userAccount;

window.addEventListener("load", async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable(); // Request account access if needed
      userAccount = web3.currentProvider.selectedAddress;
      contract = new web3.eth.Contract(contractABI, contractAddress);
      console.log("Web3 initialized successfully.");
    } catch (error) {
      console.error("User denied account access...");
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
    userAccount = web3.currentProvider.selectedAddress;
    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Web3 initialized successfully.");
  }
  // Non-dapp browsers...
  else {
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
});

async function deposit() {
  const value = web3.utils.toWei("0.0001", "ether"); // Replace '1' with the gift card value in Ether
  try {
    await contract.methods.deposit().send({ from: userAccount, value });
    alert("Deposit successful");
  } catch (error) {
    console.error("Error in deposit:", error);
  }
}

async function confirmDelivery() {
  try {
    await contract.methods.confirmDelivery().send({ from: userAccount });
    alert("Delivery confirmed");
  } catch (error) {
    console.error("Error in confirmDelivery:", error);
  }
}

async function refundBuyer() {
  try {
    await contract.methods.refundBuyer().send({ from: userAccount });
    alert("Buyer refunded");
  } catch (error) {
    console.error("Error in refundBuyer:", error);
  }
}

async function updateEscrowAgent() {
  const newEscrowAgent = document.getElementById("newEscrowAgent").value;
  try {
    await contract.methods
      .updateEscrowAgent(newEscrowAgent)
      .send({ from: userAccount });
    alert("Escrow agent updated");
  } catch (error) {
    console.error("Error in updateEscrowAgent:", error);
  }
}
