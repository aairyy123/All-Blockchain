import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import BlogPost from "./components/BlogPost";
import { uploadToIPFS } from "./utils/ipfs";
import BlogABI from "./abi/Blog.json";
import './App.css';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [account, setAccount] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", ([address]) => {
        setAccount(address);
      });

    }
    loadPosts();
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, BlogABI, signer);
      const result = await contract.getAllPosts();
      setPosts(result);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install Metamask to connect your wallet.");
        return;
      }

      const [selected] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(selected);
      console.log("Wallet connected:", selected);
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  const loadPosts = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, BlogABI.abi, provider);
      const result = await contract.getAllPosts();
      setPosts(result);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  const submitPost = async () => {
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    try {
      console.log("Uploading to IPFS...");
      const cid = await uploadToIPFS({ title, content });

      console.log("CID from IPFS:", cid);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, BlogABI, signer);

      console.log("Calling createPost on contract...");
      const tx = await contract.createPost(title, cid);
      await tx.wait();

      console.log("Post submitted successfully");
      loadPosts();
    } catch (err) {
      console.error("Error submitting post:", err);
      alert(`Failed to post: ${err.message}`);
    }
  };


  return (
    <div className="app-container">
      <div className="content-box">
        <h1>📝 Decentralized Blog</h1>
        <button className="connect-button" onClick={connectWallet}>
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>

        <input
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Blog Title"
        />

        <textarea
          className="textarea-field"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog content here..."
        />

        <button className="post-button" onClick={submitPost}>Post Blog</button>

        <hr className="divider" />

        {posts.map((post, i) => (
          <BlogPost
            key={i}
            title={post.title}
            cid={post.cid}
            author={post.author}
            timestamp={post.timestamp}
          />
        ))}

         <div style={{ marginTop: "40px" }}>
        <h2>🗂️ All Blog Titles</h2>
        <ul style={{ paddingLeft: "20px" }}>
          {posts.length === 0 ? (
            <p>No blogs posted yet.</p>
          ) : (
            posts.map((post, index) => (
              <li key={index} style={{ fontSize: "18px", marginBottom: "10px" }}>
                📌 {post.title}
              </li>
            ))
          )}
        </ul>
      </div>
      </div>
     
    </div>
  );
}

export default App;
