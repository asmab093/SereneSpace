const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Helper to create JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // This Regex requires: min 6 chars, at least 1 letter, 1 number, and 1 special char
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        //400: a client-side HTTP status code indicating the server cannot process the request due to invalid syntax
        success: false,
        message:
          "Password must be at least 6 characters and include a letter, a number, and a special character (@$!%*#?&).",
      });
    }

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    // 2. Create new user//User.create() is a helper function
    // that does the new User() and the .save() for you in single step.
    const user = await User.create({ username, email, password });

    if (user) {
      res.status(201).json({
        //201>  the client's request has been successfully fulfilled and has resulted in one or more new resources being created on the server.
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        token: generateToken(user._id), // Send token back immediately
        hasAddedContact: user.hasAddedContact,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addEmergencyContact = async (req, res) => {
  try {
    const { userId, contactName, relation, countryCode, contactPhone } =
      req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        emergencyContact: {
          name: contactName,
          relation: relation,
          countryCode: countryCode,
          phone: contactPhone,
        },
        hasAddedContact: true,
      },
      { new: true },
    );

    console.log(
      "user returned from EmergencyContactCont aftr findByIdAndUpdate",
      user,
    ); ////user returned from EmergencyContactCont aftr findByIdAndUpdate {
    //   emergencyContact: {
    //     name: 'briha', relation: 'friend', countryCode: '+92',phone: '3340062243'
    //   },
    //   _id: new ObjectId('69b92c78ae8b04d7a249cf3f'),
    //   username: 'asma',
    //   email: 'asma123@gmail.com',
    //   password: '$2b$10$NspTY/rrpx1MnWMBDEqln.BCDZzhyW5HY79jOJLa6rNXhwXZwQPEq',
    //   hasAddedContact: true,
    //   createdAt: 2026-03-17T10:27:04.246Z,
    //   __v: 0
    // }
    res
      .status(200)
      .json({ success: true, message: "Emergency details secured!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("userFound from db in login scr is", user); //userFound from db in login scr is {
    //   emergencyContact: {
    // name: 'briha',relation: 'friend',countryCode: '+92',phone: '3340062243'
    //   },
    //   _id: new ObjectId('69b92c78ae8b04d7a249cf3f'),
    //   username: 'asma',email: 'asma123@gmail.com',
    //   password: '$2b$10$NspTY/rrpx1MnWMBDE',hasAddedContact: true,
    //   createdAt: 2026-03-17T10:27:04.246Z,
    // }
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    // 2. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.status(200).json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        hasAddedContact: user.hasAddedContact, // ⬅️ Crucial for our navigation logic
        token: generateToken(user._id),
        createdAt: user.createdAt,
        emergencyContact: user.emergencyContact,
        communityProfile: user.communityProfile,
        joinedGroups: user.joinedGroups,
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//1. Update Username
exports.updateUsername = async (req, res) => {
  try {
    const { userId, newUsername } = req.body;
    console.log("new username is ", newUsername);
    // Find user and update
    const user = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true },
    );
    console.log("user after updated userName", user);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // ✅ Return the user object so the frontend can call login(updatedUser)
    res.status(200).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      hasAddedContact: user.hasAddedContact,
      emergencyContact: user.emergencyContact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    // Verify Old Password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Old password incorrect" });

    // Update with New Password (Mongoose middleware will hash this automatically)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 600000; // 10 mins
    await user.save({ validateBeforeSave: false });

    // --- EMAIL TRANSPORT SETUP ---
    // --- UPDATED EMAIL TRANSPORT SETUP ---
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Adding a timeout setting so it doesn't hang for 4 minutes
      connectionTimeout: 10000, // 10 seconds
    });

    const mailOptions = {
      from: `"Serene Space Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #7E57C2; text-align: center;">Serene Space</h2>
                    <p>Hi there,</p>
                    <p>We received a request to reset your password. Use the code below to proceed:</p>
                    <div style="background-color: #F3E5F5; padding: 20px; text-align: center; border-radius: 8px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #512DA8;">${otp}</span>
                    </div>
                    <p style="margin-top: 20px; font-size: 13px; color: #666;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your email!" });
  } catch (error) {
    // <--- UPDATE STARTING FROM HERE
    // This will print the EXACT error from Google/Nodemailer in your Render logs
    console.error("DETAILED MAIL ERROR:", error.message);
    console.error("ERROR CODE:", error.code);

    return res.status(500).json({
      success: false,
      message: `Mail Error: ${error.code || "Unknown"}`,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Update password (Mongoose middleware will hash this)
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
