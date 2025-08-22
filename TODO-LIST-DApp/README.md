To-Do DApp
A decentralized to-do list application built on Ethereum blockchain that allows users to manage their tasks securely and transparently.

Features
Blockchain Integration: All tasks are stored on the Ethereum blockchain
MetaMask Wallet Integration: Secure authentication and transaction signing
Real-time Task Management: Add and complete tasks with immediate feedback
Elegant UI/UX: Modern glassmorphism design with smooth animations
Responsive Design: Works seamlessly on desktop and mobile devices

Tech Stack
Frontend: React.js, Ethers.js
Blockchain: Ethereum Smart Contracts
Styling: CSS-in-JS with modern design principles
Notifications: React Toastify for user feedback

Installation
1.Clone the repository:
  git clone <your-repo-url>
  cd todo-dapp

2.Install dependencies:
  npm install
3.Set up environment variables:
Create a .env file in the root directory and add:
  REACT_APP_CONTRACT_ADDRESS=your_contract_address_here

4.Start the development server:
  npm start

Smart Contract Setup :
This DApp requires a deployed smart contract with the following interface:

  solidity :
    //SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

contract TodoList {
    // Define a Task structure with a description and completion status
    struct Task {
        string description;
        bool completed;
    }

    Task[] public tasks;  // dynamic array of Task structs

    // Add a new task to the list {description provided by user}
    function addTask(string memory _desc) public {
        tasks.push(Task(_desc, false));
    }

    // Mark a task as completed by index
    function markCompleted(uint _index) public {
        require(_index < tasks.length, "Index out of range");
        tasks[_index].completed = true;
    }

    // Get a task's details by index {returns tuple: description and completed flag}
    function getTask(uint _index) public view returns (string memory, bool) {
         require(_index < tasks.length, "Index out of range");
        Task storage t = tasks[_index];
        return (t.description, t.completed);
    }

    //Get the total number of tasks
    function getTotalTasks() public view returns (uint){
        return tasks.length;
    }
}  

Deploy this contract to your preferred Ethereum network (Mainnet, Goerli, Sepolia, or local Hardhat node).

Design Features :
Modern Glassmorphism UI: Frosted glass effect with subtle borders
Gradient Backgrounds: Beautiful color transitions throughout the interface
Interactive Elements: Hover effects and smooth animations
Custom Checkboxes: Visual indicators for task completion status
Responsive Layout: Adapts to different screen sizes

Functionality :
Wallet Connection
Connect MetaMask wallet with one click
Display truncated wallet address for privacy
Easy disconnect functionality

Task Management :
Add new tasks to the blockchain
Mark tasks as completed (immutable on blockchain)
Real-time task list updates
Visual status indicators (Pending/Completed)

Usage:
Connect Wallet: Click the "Connect MetaMask Wallet" button
Add Task: Type your task in the input field and click "Add Task"
Complete Task: Use the dropdown to mark tasks as completed
View Tasks: Your task list is automatically loaded from the blockchain

Browser Support
  This DApp requires:

    Modern browser with Ethereum support (Chrome, Firefox, Brave)
    MetaMask extension installed
    Network connectivity to Ethereum blockchain

Configuration :
The application can be configured for different networks by updating the contract address in the environment variables.

Troubleshooting :
Common issues and solutions:
  "Contract address is missing" error: Ensure your .env file contains the correct contract address
  Transaction failures: Check that you have sufficient ETH for gas fees
  Network errors: Verify you're connected to the correct Ethereum network
  MetaMask connection issues: Try reinstalling MetaMask or checking permissions

License :
This project is licensed under the MIT License.
