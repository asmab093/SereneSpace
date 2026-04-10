const express = require("express");
const router = express.Router();
const { createPost, getGroupPosts,likePost,addReply,deletePost,deleteReply} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createPost);
router.get("/:groupId", getGroupPosts); // Matches the frontend call
router.put("/:postId/like", likePost);
router.post("/:postId/replies", protect, addReply);
router.delete("/:postId", protect, deletePost);
router.delete("/replies/:replyId", protect, deleteReply);

module.exports = router;