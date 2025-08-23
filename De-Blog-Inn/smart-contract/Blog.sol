// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Blog {
    struct Post {
        string title;
        string cid;
        address author;
        uint timestamp;
        bool isDeleted;
    }

    Post[] public posts;

    // Post ID => user => rating (0 = So-so, 1 = Good, 2 = Best)
    mapping(uint => mapping(address => uint)) public ratings;

    event BlogPosted(string title, string cid, address author, uint timestamp);
    event BlogEdited(uint index, string newTitle, string newCid, uint newTimestamp);
    event BlogDeleted(uint index, address author);
    event BlogReposted(uint oldIndex, uint newIndex, address newAuthor);
    event BlogRated(uint index, address rater, uint rating);

    function createPost(string memory title, string memory cid) public {
        posts.push(Post(title, cid, msg.sender, block.timestamp, false));
        emit BlogPosted(title, cid, msg.sender, block.timestamp);
    }

    function getAllPosts() public view returns (Post[] memory) {
        return posts;
    }

    function editPost(uint index, string memory newTitle, string memory newCid) public {
        require(index < posts.length, "Invalid index");
        Post storage post = posts[index];
        require(post.author == msg.sender, "Not your post");
        require(!post.isDeleted, "Cannot edit deleted post");

        post.title = newTitle;
        post.cid = newCid;
        post.timestamp = block.timestamp;

        emit BlogEdited(index, newTitle, newCid, post.timestamp);
    }

    function deletePost(uint index) public {
        require(index < posts.length, "Invalid index");
        Post storage post = posts[index];
        require(post.author == msg.sender, "Not your post");
        require(!post.isDeleted, "Already deleted");

        post.isDeleted = true;

        emit BlogDeleted(index, msg.sender);
    }

    function repost(uint index) public {
        require(index < posts.length, "Invalid index");
        Post storage oldPost = posts[index];
        require(!oldPost.isDeleted, "Cannot repost deleted post");

        posts.push(Post(oldPost.title, oldPost.cid, msg.sender, block.timestamp, false));
        emit BlogReposted(index, posts.length - 1, msg.sender);
    }

    function ratePost(uint index, uint rating) public {
        require(index < posts.length, "Invalid index");
        require(rating <= 2, "Invalid rating");
        require(!posts[index].isDeleted, "Cannot rate deleted post");

        ratings[index][msg.sender] = rating;
        emit BlogRated(index, msg.sender, rating);
    }
}
