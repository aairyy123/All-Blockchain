Decentralized Blogging Dapp : De-Blogg-Inn
A decentralized blogging platform built on Ethereum (Sepolia Testnet) with IPFS + Pinata for permanent storage. 
Users can connect their Ethereum wallet, publish blogs, view all blogs, edit, delete, and rate them.
 
Features
   • Authentication & Wallet
  •	Connect Ethereum wallet via MetaMask
  •	Shows connected wallet address on the frontend

Blog Management :
•	Create Blog Post
  o	Enter a title and content
  o	Content is stored on IPFS (via Pinata)
  o	Smart contract stores title, IPFS CID, author, and timestamp

•	View Blogs
  o	Displays all posts with title, author, timestamp
  o	Fetches content from IPFS when opened
•	Edit & Repost
  o	Authors can edit their blog content
  o	Updated blog replaces the old content on IPFS
•	Delete Post
  o	Authors can remove their own blogs from the smart contract

Smart Contract (Solidity) :
	// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Blog {
    struct Post {
        string title;
        string cid;
        address author;
        uint timestamp;
    }

    Post[] public posts;

    event BlogPosted(string title, string cid, address author, uint timestamp);

    function createPost(string memory title, string memory cid) public {
        posts.push(Post(title, cid, msg.sender, block.timestamp));
        emit BlogPosted(title, cid, msg.sender, block.timestamp);
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }
}

Tech Stack
  •	Smart Contract → Solidity (Ethereum Sepolia Testnet)
  •	Blockchain Tools → Hardhat / Remix, MetaMask
  •	Storage → IPFS + Pinata
  •	Frontend → React.js
  •	Backend (optional) → Node.js + Express
  •	Libraries → ethers.js / web3.js

Frontend (React.js)
  •	Simple and elegant UI
  •	Background image with styled layout
  •	Buttons for:
  o	Connect Wallet
  o	Post Blog
  o	Edit
  o	Delete
  o	Repost
Backend (Optional - Node.js/Express)
  •	Handles IPFS upload using Pinata API
  •	Provides endpoints like /upload for blog content
De-Blog-Inn
•	README.md     
•	Backend
•	Routes
	blogRoutes.js
•	.env
•	server.js

•	Frontend
•	d-blog-inn
	public
	index.html
	src
	abi
•	Blog.json
	components
•	BLogPost.js
	Utils
•	Ipfs.js
	App.css
	App.js
	Background pic
	Index.css
	Index.js
	.env
•	Smart-contract
o	.env
o	Blog.sol
o	Scripts
	Deploy.js

How It Works
1.	Connect Ethereum Wallet via MetaMask
2.	Write blog → Upload content to IPFS (Pinata)
3.	Store blog metadata (title, CID, author, timestamp) in Ethereum Smart Contract
4.	Fetch all posts from contract and display in frontend
5.	Allow Edit / Delete / Repost / Rate functionality

1.Backend Setup
  cd ../backend
  npm init -y
  npm install express cors multer axios dotenv
.env file
  PINATA_API_KEY=your_pinata_api_key
  PINATAZ_API_SECRET=your_pinata_secret

2. Frontend Setup
  cd ../frontend
  npx create-react-app .
  npm install ethers
3. Smart Contract Setup
    Navigate into smart-contract:
      cd smart-contract
      npm init -y
      npm install --save-dev hardhat
      npx hardhat
      Choose Create a basic sample project.
    Install required dependencies:
      npm install @nomicfoundation/hardhat-toolbox dotenv
      Deploy
      npx hardhat compile
      npx hardhat run scripts/deploy.js --network sepolia
    Copy the deployed contract address.

Postman API Testing
  •	Run backend:
      cd backend
      node server.js
  •	Open Postman:
      o	POST to: http://localhost:5000/api/blogs/upload
      o	Body: form-data
      	file: Upload blog.json or any .txt
      	title: Your blog title
      o	Get back a cid!

	You need three separate .env files:
1. smart-contract/.env – for deploying to Sepolia (via Infura)
    PRIVATE_KEY=your_ethereum_wallet_private_key
    SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
2.  backend/.env – for Pinata API (IPFS uploads)
    PINATA_API_KEY=your_pinata_api_key
    PINATA_API_SECRET=your_pinata_secret_api_key
Steps to Get Sepolia RPC URL in Infura
    1. Login to https://infura.io
    2. Go to your Dashboard.
    3.Click "Create New Key" (or use an existing one).
    4.Select Ethereum as the network type.
    5.After the key is created:
    6.Get your RPC URL like this:
      https://sepolia.infura.io/v3/your_project_id
3.frontend/.env 
    REACT_APP_CONTRACT_ADDRESS=”Your Address”
    REACT_APP_NETWORK=”Your Network”

	Start Everything
  •	Backend: 
      cd backend  
      node server.js
  •	Frontend:
      cd frontend 
      npm start
  •	Smart Contract: already deployed on Sepolia
