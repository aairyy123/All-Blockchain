import React from "react";

function BlogPost({ title, cid, author, timestamp }) {
  const date = new Date(Number(timestamp) * 1000).toLocaleString();

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
      <h3>{title}</h3>
      <p>By: {author}</p>
      <p>Date: {date}</p>
      <a href={`https://gateway.pinata.cloud/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">
        Read Blog
      </a>
    </div>
  );
}

export default BlogPost;
