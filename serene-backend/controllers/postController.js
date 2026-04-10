const Post = require("../models/Post");
const Reply = require("../models/Reply"); // Import the new model
const { checkProfanity } = require("glin-profanity");
exports.createPost = async (req, res) => {
  try {
    const { content, group, isAnonymous } = req.body;

    const result = checkProfanity(content);

    if (result.containsProfanity) {
      return res.status(400).json({
        success: false,
        message:
          "Your post contains words that don't follow our supportive community guidelines. Please rephrase it.",
      });
    }
    // 2. If it's clean, proceed with saving
    const newPost = new Post({
      user: req.user.id,
      group,
      content,
      isAnonymous,
    });
    await newPost.save();

    // Return the post with user info populated for immediate UI update
    const populatedPost = await Post.findById(newPost._id).populate(
      "user",
      "username communityProfile",
    );
    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a Reply
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    const result = checkProfanity(content);

    // Match the structure the frontend is looking for
    if (result.containsProfanity) {
      return res.status(400).json({
        success: false,
        message: "Please keep your replies supportive. Profanity is not allowed.",
      });
    }

    const newReply = new Reply({
      post: postId,
      user: req.user.id,
      content,
    });
    await newReply.save();

    // Push the reply ID to the Post's replies array
    await Post.findByIdAndUpdate(postId, { $push: { replies: newReply._id } });

    // Populate user info for the UI
    const populatedReply = await Reply.findById(newReply._id).populate(
      "user",
      "username communityProfile",
    );

    res.status(201).json({ success: true, data: populatedReply });
  } catch (error) {
    console.error("Reply Controller Error:", error);
    // ✅ Ensure we send a JSON object with the message key
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    });
  }
};

exports.getGroupPosts = async (req, res) => {
  try {
    const posts = await Post.find({ group: req.params.groupId })
      .populate("user", "username communityProfile")
      .populate({
        path: "replies",
        populate: { path: "user", select: "username communityProfile" },
      })
      .sort({ createdAt: -1 }); // Newest first
  // "data": [
  //   {
  //     "_id": "P1",
  //     "content": "Feeling stressed",
  //     "user": {
  //       "username": "ayesha",
  //       "communityProfile": { "avatarId": 6 }
  //     },
    //   "replies": [
    //     {
    //       "content": "Stay strong!",
    //       "user": { "username": "briha", "communityProfile": { "avatarId": 1 } }
    //     }
    //   ],
    //   "createdAt": "2026-04-10T..."
    // }
 
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Like (Increment/Decrement)
exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    const increment = action === "like" ? 1 : -1;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: increment } },
      { new: true },
    );

    res.status(200).json({ success: true, likes: updatedPost.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a Post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

    // Check ownership
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    // Delete associated replies first
    await Reply.deleteMany({ post: post._id });
    await post.deleteOne();

    res.status(200).json({ success: true, message: "Post removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a Reply
exports.deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);
    if (!reply)
      return res
        .status(404)
        .json({ success: false, message: "Reply not found" });

    // Check ownership
    if (reply.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    // Remove reference from Post
    await Post.findByIdAndUpdate(reply.post, { $pull: { replies: reply._id } });
    await reply.deleteOne();
    res.status(200).json({ success: true, message: "Reply removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
