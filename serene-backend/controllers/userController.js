const User = require("../models/User");

// Update Community Profile (Bio and Avatar)
exports.updateCommunityProfile = async (req, res) => {
  try {
    const { bio, avatarId } = req.body;
    const userId = req.user.id; // Assume your auth middleware provides this

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "communityProfile.bio": bio,
          "communityProfile.avatarId": avatarId,
          "communityProfile.hasCompletedProfile": true,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Join or Leave Groups
exports.updateJoinedGroups = async (req, res) => {
  try {
    const { groups } = req.body; // Expecting an array of group IDs
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { joinedGroups: groups } },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};