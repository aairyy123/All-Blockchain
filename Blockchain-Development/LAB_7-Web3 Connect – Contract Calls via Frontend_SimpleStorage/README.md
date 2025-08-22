# Simple Storage DApp

A decentralized application (DApp) built with React that interacts with a SimpleStorage smart contract on the Ethereum blockchain. 
This app allows users to connect their MetaMask wallet, store a number on-chain, and retrieve the current stored value.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Ethers.js](https://img.shields.io/badge/ethers.js-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![MetaMask](https://img.shields.io/badge/MetaMask-FF7139?style=for-the-badge&logo=metamask&logoColor=white)

## ✨ Features

-   **Wallet Connection**: Seamlessly connect and disconnect your MetaMask wallet.
-   **Read from Blockchain**: Fetch and display the current value stored in the smart contract.
-   **Write to Blockchain**: Update the stored value by sending a transaction.
-   **Transaction Feedback**: User-friendly toast notifications for transaction status (success, pending, failure).
-   **Responsive UI**: Clean and modern dark-themed user interface.

## 🚀 Live Demo / Quick Start

A live demo is not currently deployed. To run this project locally, follow the instructions below.

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
-   **Node.js** (v16 or higher) and **npm**
-   **MetaMask** browser extension installed in your browser.
    -   Configure it to connect to a test network like Sepolia or a local development network like Hardhat.

## 🛠️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <your-repository-url>
    cd simple-storage-dapp
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    -   Duplicate the `.env.example` file and rename it to `.env`.
    -   Open the `.env` file and add your smart contract address:
    ```plaintext
    REACT_APP_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
    REACT_APP_NETWORK=Your_Deployed_Network
    ```
    *Replace `0xYourDeployedContractAddressHere` with the actual address and replace "Your_Deployed_Network" with the test network where your SimpleStorage contract is deployed.*

4.  **Start the development server**
    ```bash
    npm start
    ```
    The app will open in your browser on [`http://localhost:3000`](http://localhost:3000).

## 📖 Usage

1.  **Connect Your Wallet**: Click the "Connect MetaMask Wallet" button. MetaMask will prompt you to connect your account and sign the message.
2.  **View Stored Value**: Once connected, the current value from the smart contract will be displayed.
3.  **Update Stored Value**:
    -   Enter a new number in the input field.
    -   Click the "Update" button.
    -   Confirm the transaction in the MetaMask popup.
    -   Wait for the transaction to be confirmed on the blockchain. You will see a success notification.
4.  **Refresh Data**: Click the "Retrieve Latest Data" button to manually refresh the displayed value after a transaction.
5.  **Disconnect**: Click "Disconnect Wallet" to reset the application state.

## 🏗️ Smart Contract

This DApp interacts with a `SimpleStorage.sol` smart contract. The contract must have the following ABI interface:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private value;

    function set(uint256 newValue) public {
        value = newValue;
    }

    function get() public view returns (uint256) {
        return value;
    }
}
